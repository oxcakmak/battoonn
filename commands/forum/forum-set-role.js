const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");
const { Forums } = require("../../database/schemas");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("forum-set-role")
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

      const checkRole = await interaction.guild.roles.cache.get(role);

      if (!checkRole)
        return await interaction.reply({
          content: _("role_not_found"),
        });

      const forumsQuery = await Forums.findOne({
        server: interaction.guild.id,
      });

      if (!forumsQuery) {
        const newForums = new Forums({
          server: interaction.guild.id,
          solvedText: null,
          allowedRole: role.id,
        });

        const savedForums = await newForums.save();

        if (!savedForums)
          return await interaction.reply({
            content: _("forum_not_registered"),
            ephemeral: true,
          });

        return await interaction.reply({
          content: _("forum_registered"),
          ephemeral: true,
        });
      }

      if (role) forumsQuery.allowedRole = role.id;

      const updatedForums = await forumsQuery.save();

      if (!updatedForums)
        return await interaction.reply({
          content: _("forum_not_updated"),
          ephemeral: true,
        });

      return await interaction.reply({
        content: _("forum_updated"),
        ephemeral: true,
      });
    } catch (error) {
      return await interaction.reply({
        content: _("an_unknown_error_occurred"),
      });
    }
  },
};
