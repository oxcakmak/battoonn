const voice = require("@discordjs/voice");
const play = require("play-dl");
const Queue = require("better-queue");
const { _ } = require("../utils/localization");

// Create a new queue
const queue = new Queue(function (input) {
  // Process the input here
  // console.log("Processing:", input);
  // Call the callback when processing is complete
  // cb(null, input);
});

async function playQueue(interaction, channel, currentChannel) {
  const nextSong = await queue.process();
  queue.on("next", async (data) => {
    console.log(data);
    if (!nextSong) {
      connection.destroy(); // Disconnect when queue is empty
      return interaction.followUp({ content: "Müzik sırası bitti!" });
    }

    console.log(nextSong);

    const connection = await voice.joinVoiceChannel({
      channelId: currentChannel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
      selfDeaf: true,
      selfMute: false,
    });

    const stream = await play.stream(nextSong.url);
    const resource = await voice.createAudioResource(stream.stream, {
      inputType: stream.type,
    });

    const player = await voice.createAudioPlayer();

    await player.play(resource);

    await connection.subscribe(player);

    await message.delete();

    await channel.send({
      embeds: [
        {
          type: "rich",
          title: _("now_playing"),
          description: `**[${nextSong.title}](${nextSong.url})**`,
          thumbnail: {
            url: nextSong.thumbnail,
            width: 0,
            height: 0,
          },
          footer: {
            text: "Requested by " + nextSong.requestBy,
            /* icon_url: await interaction.user.avatarURL(), */
          },
          timestamp: nextSong.requestedTime,
        },
      ],
    });
  });
}

module.exports = { queue, playQueue };
