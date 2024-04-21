const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");
const { MusicConfigs } = require("../../database/schemas");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("music-dj")
    .setDescription(_("forum_role"))
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription(_("forum_lock_unlock_edit_the_thread_title_role"))
        .setRequired(true)
    ),
  async execute(interaction) {
    if (interaction.bot) return;

    // Check if the user has permission to ban members
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await interaction.reply({
        content: _("you_do_not_have_permission_command"),
        ephemeral: true,
      });

    try {
      const role = await interaction.options.getRole("role");

      if (!role)
        return await interaction.reply({
          content: _("role_not_selected"),
        });

      const checkRole = await interaction.guild.roles.cache.get(role.id);

      if (!checkRole)
        return await interaction.reply({
          content: _("role_not_found"),
        });

      const MusicConfigsQuery = await MusicConfigs.findOne({
        server: interaction.guild.id,
      });

      if (role) MusicConfigsQuery.djRole = checkRole.id;

      const updatedMusicConfigs = await MusicConfigsQuery.save();

      if (!updatedMusicConfigs)
        return await interaction.reply({
          content: _("forum_not_updated"),
          ephemeral: true,
        });

      return await interaction.reply({
        content: _("forum_updated"),
      });
    } catch (error) {
      return await interaction.reply({
        content: _("an_unknown_error_occurred"),
      });
    }
  },
};
