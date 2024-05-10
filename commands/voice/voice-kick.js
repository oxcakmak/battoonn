const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("voice-kick")
    .setDescription(_("move_user_to_voice_channel"))
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription(_("filter_by_user"))
        .setRequired(true)
    ),
  async execute(interaction) {
    if (interaction.bot) return;

    const userId = interaction.options.getUser("user").id;

    if (!interaction.guild.members.cache.has(userId))
      return await interaction.reply({
        content: "Invalid user ID or user not found.",
        ephemeral: true,
      });

    const targetUser = interaction.guild.members.cache.get(userId);

    if (
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

      await targetUser.voice.disconnect();
      await interaction.reply({
        content: `${targetUser.tag} has been moved.`,
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
