const play = require("play-dl");
const { _ } = require("../../utils/localization");
const { addQueue } = require("../../vendor/queue");

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    const { customId, guild, message, channel } = await interaction;

    const member = await guild.members.fetch(interaction.user.id);

    if (!member) return false;

    if (!interaction.isStringSelectMenu() && customId !== "musicResults")
      return false;

    const selectedTrack = await interaction.values[0];

    const voiceState = member.voice;
    const currentChannel = interaction.member.voice.channel;

    if (
      !currentChannel ||
      !voiceState ||
      !voiceState.channel ||
      voiceState.channel.id !== currentChannel.id
    )
      return await interaction.editReply({
        content: _("you_must_the_audio_channel"),
      });

    // YTDL Section start
    let video = await play.video_info(selectedTrack);
    video = video?.video_details;

    // let's defer the interaction as things can take time to process
    // await interaction.deferReply();

    await addQueue({
      data: [
        {
          server: interaction.guild.id,
          interaction: interaction,
          channel: channel,
          message: message,
          currentChannel: currentChannel,
        },
      ],
      song: [
        {
          id: video.id,
          url: selectedTrack,
          thumbnail: String(await video.thumbnails[0].url),
          title: video.title,
          channelOwner: video.channel.name,
          duration: video.durationRaw,
          length: video.durationInSec,
          requestBy: interaction.user.username,
          requestById: interaction.user.id,
          requestedTime: new Date(),
        },
      ],
    });
  },
};
