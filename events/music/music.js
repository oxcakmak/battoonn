const play = require("play-dl");
const { _ } = require("../../utils/localization");
const { addSongToQueue } = require("../../vendor/queue");

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    const { customId, guild, message, channel } = await interaction;

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
    // await interaction.deferReply();
    /*
      interaction: interaction,
      channel: channel,
      currentChannel: currentChannel,
      */

    await message.delete();

    await addSongToQueue({
      serverId: interaction.guild.id,
      interaction: interaction,
      channel: channel,
      message: message,
      currentChannel: currentChannel,
      url: selectedTrack,
      thumbnail: String(await video.thumbnails[4].url),
      title: video.title,
      channelOwner: video.channel.name,
      duration: video.durationRaw,
      length: video.durationInSec,
      requestBy: interaction.user.username,
      requestById: interaction.user.id,
      requestedTime: new Date(),
    });

    await channel.send({
      embeds: [
        {
          type: "rich",
          title: _("added_to_queue"),
          description: `**[${video.title}](${video.url})**`,
          fields: [
            {
              name: _("channel"),
              value: video.channel.name,
              inline: true,
            },
            {
              name: _("duration"),
              value: video.durationInSec,
              inline: true,
            },
          ],
          timestamp: new Date(),
          thumbnail: {
            url: String(await video.thumbnails[4].url),
            height: 0,
            width: 0,
          },
          footer: {
            text: "Requested by " + interaction.user.username,
            /* icon_url: await interaction.user.avatarURL(), */
          },
        },
      ],
    });

    // Start playing if the queue is empty
    // await playQueue(interaction, channel, currentChannel);

    // Handle new songs added to the queue

    // if (!queue.isProcessing()) await playQueue(interaction, channel);

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
