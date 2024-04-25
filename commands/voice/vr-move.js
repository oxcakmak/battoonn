const {
  ChannelType,
  PermissionsBitField,
  SlashCommandBuilder,
} = require("discord.js");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("vr-move")
    .setDescription(_("move_user_to_voice_channel"))
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription(_("filter_by_user"))
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription(_("which_channel_should_move"))
        .addChannelTypes(ChannelType.GuildVoice)
        .setRequired(true)
    ),
  async execute(interaction) {
    if (interaction.bot) return;

    const userId = interaction.options.getUser("user").id;
    const targetChannelId = interaction.options.getChannel("channel").id;

    if (!interaction.guild.members.cache.has(userId))
      return await interaction.reply({
        content: "Invalid user ID or user not found.",
        ephemeral: true,
      });

    const targetUser = interaction.guild.members.cache.get(userId);
    const targetChannel = interaction.guild.channels.cache.get(targetChannelId);

    if (
      (!targetChannel || !targetChannel.type !== 2) &&
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await interaction.reply({
        content: "Invalid channel ID or missing permissions.",
        ephemeral: true,
      });

    try {
      const voiceState = targetUser.voice;
      if (!voiceState || !voiceState.channel)
        return await interaction.reply({
          content: `${targetUser.tag} is not in a voice channel.`,
          ephemeral: true,
        });

      await targetUser.voice.setChannel(targetChannel);
      await interaction.reply({
        content: `${targetUser.tag} has been moved to ${targetChannel.name}.`,
        ephemeral: true,
      });
    } catch (error) {
      console.error("Error moving user to voice channel:", error);
      await interaction.reply({
        content: "An error occurred while moving the user.",
        ephemeral: true,
      });
    }
  },
};
