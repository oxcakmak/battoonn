const { _ } = require("../../utils/localization");
const voice = require("@discordjs/voice");
const play = require("play-dl");

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    const { customId, guild, message, channel } = await interaction;

    const serverId = guild.id;

    const member = await guild.members.fetch(interaction.user.id);

    if (!member) return false;

    if (
      !interaction.isStringSelectMenu() &&
      customId !== "spotifyResultTrackList"
    )
      return false;

    const selectedTrack = await interaction.values[0];

    if (!selectedTrack)
      return await interaction.reply({
        content: _("you_must_the_audio_channel"),
      });

    const voiceState = member.voice;
    const currentChannel = interaction.member.voice.channel;

    if (
      !currentChannel ||
      !voiceState ||
      !voiceState.channel ||
      voiceState.channel.id !== currentChannel.id
    )
      return await interaction.reply({
        content: _("you_must_the_audio_channel"),
      });

    // YTDL Section start
    let video = await play.video_info(selectedTrack);
    video = video?.video_details;

    // let's defer the interaction as things can take time to process
    await interaction.deferReply();

    const connection = await voice.joinVoiceChannel({
      channelId: currentChannel.id,
      guildId: serverId,
      adapterCreator: interaction.guild.voiceAdapterCreator,
      selfDeaf: true,
      selfMute: false,
    });

    const stream = await play.stream(selectedTrack);
    const resource = await voice.createAudioResource(stream.stream, {
      inputType: stream.type,
    });

    const player = await voice.createAudioPlayer();
    player.play(resource);

    connection.subscribe(player);

    await message.delete();

    await channel.send({
      embeds: [
        {
          type: "rich",
          title: _("now_playing"),
          description: `**[${video.title}](${video.url})**`,
          thumbnail: {
            url: String(await video.thumbnails[4].url),
            width: 0,
            height: 0,
          },
          footer: {
            text: "Requested by " + (await interaction.user.username),
            /* icon_url: await interaction.user.avatarURL(), */
          },
          timestamp: await new Date(),
        },
      ],
    });

    /*
    return await channel.send({
      embeds: [
        {
          type: "rich",
          title: _("now_playing"),
          description: `**[${video.title}](${video.url})**`,
          thumbnail: {
            url: String(await video.thumbnails[4].url),
            width: 0,
            height: 0,
          },
          footer: {
            text: "Requested by " + (await interaction.user.username),
            icon_url: await interaction.user.avatarURL(),
          },
          timestamp: await new Date(),
        },
      ],
    });
    */
  },
};
