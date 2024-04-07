const { SongQueues } = require("../database/schemas");
const voice = require("@discordjs/voice");
const play = require("play-dl");
const { _ } = require("../utils/localization");

const addQueue = async (request) => {
  try {
    const data = request.data[0];
    const song = request.song[0];
    const merge = { ...data, ...song };

    const queueDocumentCount = await SongQueues.countDocuments({
      server: data.server,
    });

    const queueQuery = await SongQueues.findOne({
      server: data.server,
      url: song.id,
      requestById: song.requestById,
    });

    if (queueQuery)
      return await data.interaction.update({
        content: _("you_have_an_music_in_queue"),
        embeds: [],
        components: [],
      });

    const addQueueQuery = await new SongQueues({
      server: data.server,
      voiceChannel: data.channel.id,
      targetChannel: data.currentChannel.id,
      url: song.id,
      thumbnail: song.thumbnail,
      title: song.title,
      channelOwner: song.channelOwner,
      duration: song.duration,
      length: song.length,
      requestBy: song.requestBy,
      requestById: song.requestById,
      requestedTime: song.requestedTime,
    });

    const addMusicTrack = await addQueueQuery.save();

    if (!addMusicTrack)
      return await data.interaction.update({
        content: _("music_not_added_to_queue"),
        embeds: [],
        components: [],
      });

    // icon_url: await interaction.user.avatarURL(),
    await data.interaction.update({
      content: "",
      components: [],
      embeds: [
        {
          type: "rich",
          title: _("added_to_queue"),
          description: `**[${song.title}](${song.url})**`,
          fields: [
            {
              name: _("channel"),
              value: song.channelOwner,
              inline: true,
            },
            {
              name: _("duration"),
              value: song.duration,
              inline: true,
            },
          ],
          timestamp: song.requestedTime,
          thumbnail: {
            url: song.thumbnail,
            height: 0,
            width: 0,
          },
          footer: {
            text: "Requested by " + song.requestBy,
          },
        },
      ],
    });

    if (queueDocumentCount === 0) await playSong(merge);
  } catch (error) {
    console.error("Error playing song:", error);
  }
};

// Function to play a song
const playSong = async (song) => {
  try {
    const connection = voice.joinVoiceChannel({
      channelId: song.currentChannel.id,
      guildId: song.interaction.guild.id,
      adapterCreator: song.interaction.guild.voiceAdapterCreator,
    });

    const stream = await play.stream(song.url);
    const resource = await voice.createAudioResource(stream.stream, {
      inputType: voice.StreamType.Opus,
    });

    const player = await voice.createAudioPlayer();

    await connection.subscribe(player);
    await player.play(resource);

    await setTimeout(async () => {
      const findAndDeleteObject = {
        server: song.interaction.guild.id,
        url: song.url,
      };

      const findMusicByQueue = await SongQueues.findOne(findAndDeleteObject);

      if (findMusicByQueue) {
        await SongQueues.deleteMany(findAndDeleteObject);
      }
    }, song.length * 1000);

    return await song.channel.send({
      embeds: [
        {
          type: "rich",
          title: _("now_playing"),
          description: `**[${song.title}](${song.url})**`,
          thumbnail: {
            url: song.thumbnail,
            width: 0,
            height: 0,
          },
          fields: [
            {
              name: _("channel"),
              value: song.channelOwner,
              inline: true,
            },
            {
              name: _("duration"),
              value: song.duration,
              inline: true,
            },
          ],
          footer: {
            text: "Requested by " + song.requestBy,
          },
          timestamp: song.requestedTime,
        },
      ],
    });
  } catch (error) {
    console.error("Error playing song:", error);
  }
};

module.exports = {
  addQueue,
};
