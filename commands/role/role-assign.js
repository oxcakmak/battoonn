const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("role-assign")
    .setDescription(_("assign_role_to_the_user"))
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription(_("filter_by_role"))
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription(_("filter_by_user"))
        .setRequired(true)
    ),

  async execute(interaction) {
    if (interaction.bot) return;

    // Check if the user has permission to ban members
    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)
    )
      return await interaction.reply({
        content: _("you_do_not_have_permission_command"),
        ephemeral: true,
      });

    const role = interaction.options.getRole("role").id;
    const user = interaction.options.getUser("user").id;

    try {
      const serverRole = await interaction.guild.roles.cache.get(role);
      const serverUser = await interaction.guild.members.cache.get(user);

      if (!serverRole)
        return await interaction.reply({
          content: _("role_not_found"),
        });

      if (serverUser.roles.cache.has(role))
        return await interaction.reply({
          content: _("user_has_role_selected"),
        });

      await serverUser.roles.add(role);
      return await interaction.reply({
        content: _("role_assigned"),
      });
    } catch (error) {
      return await interaction.reply({
        content: _("an_unknown_error_occurred"),
      });
    }
  },
};
