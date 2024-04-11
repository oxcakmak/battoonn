const play = require("play-dl");
const urlParser = require("js-video-url-parser");
const { _ } = require("../../utils/localization");
const { addQueue, playSong } = require("../../vendor/queue");

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    const { customId, guild, message, channel } = await interaction;

    const member = await guild.members.fetch(interaction.user.id);

    if (!member) return false;

    if (!interaction.isStringSelectMenu() && customId !== "musicResults")
      return false;

    try {
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
      let video = await play.video_info(
        await urlParser.create({
          videoInfo: urlParser.parse(selectedTrack),
          format: "short",
        })
      );
      video = video.video_details;

      // let's defer the interaction as things can take time to process
      // await interaction.deferReply();
      const data = {
        server: interaction.guild.id,
        interaction: interaction,
        targetChannel: channel,
        message: message,
        currentChannel: currentChannel,
      };

      const song = {
        url: selectedTrack,
        thumbnail: String(await video.thumbnails[0].url),
        title: video.title,
        channel: video.channel.name,
        duration: video.durationRaw,
        length: video.durationInSec,
        requestedBy: interaction.user.username,
        requestedById: interaction.user.id,
        requestedTime: new Date().toISOString(),
      };

      const sendData = {
        ...data,
        ...song,
      };

      await addQueue(sendData);

      await playSong(sendData);
    } catch (error) {
      console.log(error);
    }
  },
};
