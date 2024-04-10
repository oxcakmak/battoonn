const { SongQueues } = require("../database/schemas");
const voice = require("@discordjs/voice");
const play = require("play-dl");
const urlParser = require("js-video-url-parser");
const { _ } = require("../utils/localization");

let musicQueue = []; // Array to store song objects
let currentSongIndex = 0; // Index of the currently playing song (starts at -1)
let isPlaying = false; // Flag to track playback state

async function addQueue(request) {
  try {
    const queueQuery = await SongQueues.findOne({
      server: request.server,
      url: request.id,
      requestedById: request.requestedById,
    });

    if (queueQuery) {
      await request.interaction.update({
        content: _("you_have_an_music_in_queue"),
        embeds: [],
        components: [],
      });
      return;
    }

    const addQueueQuery = await new SongQueues({
      server: request.server,
      voiceChannel: request.channel.id,
      targetChannel: request.currentChannel.id,
      url: request.id,
      thumbnail: request.thumbnail,
      title: request.title,
      channelOwner: request.channelOwner,
      duration: request.duration,
      length: request.length,
      requestedBy: request.requestedBy,
      requestedById: request.requestedById,
      requestedTime: request.requestedTime,
    });

    await addQueueQuery.save();

    // icon_url: await interaction.user.avatarURL(),
    await request.channel.send({
      content: "",
      components: [],
      embeds: [
        {
          type: "rich",
          title: _("added_to_queue"),
          description: `**[${request.title}](${request.url})**`,
          fields: [
            {
              name: _("channel"),
              value: request.channelOwner,
              inline: true,
            },
            {
              name: _("duration"),
              value: request.duration,
              inline: true,
            },
          ],
          timestamp: request.requestedTime,
          thumbnail: {
            url: request.thumbnail,
            height: 0,
            width: 0,
          },
          footer: {
            text: "Requested by " + request.requestedBy,
          },
        },
      ],
    });

    return Promise.resolve(); // Resolve the promise after successful addition
  } catch (error) {
    console.error("Error playing song:", error);
  }
}

const playSong = async (song) => {
  try {
    if (isPlaying) return;

    const connection = voice.joinVoiceChannel({
      channelId: song.currentChannel.id,
      guildId: song.server,
      adapterCreator: song.interaction.guild.voiceAdapterCreator,
    });

    let video = await play.video_info(
      await urlParser.create({
        videoInfo: urlParser.parse(song.url),
        format: "short",
      })
    );
    video = video.video_details;

    console.log(video);

    const stream = await play.stream(
      await urlParser.create({
        videoInfo: urlParser.parse(song.url),
        format: "short",
      }),
      {
        source: {
          youtube: "video",
        },
      }
    );
    const resource = await voice.createAudioResource(stream.stream, {
      inputType: voice.StreamType.Opus,
    });

    const player = await voice.createAudioPlayer();

    await connection.subscribe(player);
    await player.play(resource);

    await song.channel.send({
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
            text: "Requested by " + song.requestedBy,
          },
          timestamp: song.requestedTime,
        },
      ],
    });

    isPlaying = true; // Simulate starting playback

    await player.on("idle", async () => {
      isPlaying = false; // Simulate starting playback

      // Player becomes idle after the stream ends
      console.log("Song finished. Playing next song...");
      await SongQueues.findOneAndDelete({
        server: song.server,
        url: song.url,
      });
      await nextSong(song); // Call nextSong function to handle transitioning
    });

    await Promise.resolve();
  } catch (error) {
    console.error("Error playing song:", error.message);
  }
};

const nextSong = async (data) => {
  try {
    const musicQueue = await SongQueues.find({
      server: data.server,
    });

    if (!musicQueue || musicQueue.length === 0) {
      await data.interaction.channel.send({
        content: _("next_music_not_available"),
        embeds: [],
        components: [],
      });
      return;
    }

    currentSongIndex++;
    if (currentSongIndex >= musicQueue.length) {
      currentSongIndex = musicQueue.length - 1; // Stay on the last song
    }

    const song = musicQueue[currentSongIndex];
    console.log(song);
    const newData = {
      server: data.interaction.guild.id,
      interaction: data.interaction,
      channel: data.channel,
      message: data.message,
      currentChannel: data.currentChannel,
    };

    const sendData = {
      ...newData,
      ...song,
    };

    await playSong(sendData);
  } catch (error) {
    console.error(error);
  }
};

const skipSong = async (data) => {
  try {
    const musicQueue = await SongQueues.find({
      server: data.server,
    });

    if (!musicQueue || musicQueue.length === 0) {
      await data.channel.send({
        content: _("next_music_not_available"),
        embeds: [],
        components: [],
      });
      return;
    }

    currentSongIndex++;
    if (currentSongIndex >= musicQueue.length) {
      currentSongIndex = musicQueue.length - 1; // Stay on the last song
    }

    const song = musicQueue[currentSongIndex];

    const newData = {
      server: data.interaction.guild.id,
      interaction: data.interaction,
      channel: data.channel,
      message: data.message,
      currentChannel: data.currentChannel,
    };

    const sendData = {
      ...newData,
      ...song,
    };

    await playSong(sendData);
  } catch (error) {
    console.error(error);
  }
};

const jumpToSong = async (data) => {
  try {
    const musicQueue = await SongQueues.find({
      server: data.server,
    });

    if (!musicQueue || musicQueue.length === 0) {
      await data.channel.send({
        content: _("next_music_not_available"),
        embeds: [],
        components: [],
      });
      return;
    }

    if (songIndex < 0 || songIndex >= musicQueue.length) {
      await data.channel.send({
        content: _("invalid_music_order"),
        embeds: [],
        components: [],
      });
      return;
    }

    currentSongIndex++;
    if (currentSongIndex >= musicQueue.length) {
      currentSongIndex = musicQueue.length - 1; // Stay on the last song
    }

    let previousSongs = [];
    const queueLength = musicQueue.length;

    /*
    // Handle looping back to the beginning
    for (let i = currentSongIndex - 1; i >= 0; i--) {
      previousSongs.push(musicQueue[i]);
    }
    */

    // Handle songs before the current index
    for (let i = queueLength - 1; i > currentSongIndex; i--) {
      previousSongs.push(musicQueue[i]);
    }

    await SongQueues.updateOne(
      { server: data.server },
      {
        $pullAll: previousSongs,
      }
    )
      .then(() => console.log("Veriler silindi"))
      .catch((err) => console.error(err));

    const song = musicQueue[currentSongIndex];

    const newData = {
      server: data.interaction.guild.id,
      interaction: data.interaction,
      channel: data.channel,
      message: data.message,
      currentChannel: data.currentChannel,
    };

    const sendData = {
      ...newData,
      ...song,
    };

    await playSong(sendData);
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  addQueue,
  playSong,
  nextSong,
  skipSong,
  jumpToSong,
};
