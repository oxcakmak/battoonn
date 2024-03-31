const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("role-drop")
    .setDescription(_("remove_the_user_role"))
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
    const serverRole = await interaction.guild.roles.cache.get(role);
    const serverUser = await interaction.guild.members.cache.get(user);

    if (!serverRole)
      return await interaction.reply({
        content: _("role_not_found"),
      });

    if (!serverUser)
      return await interaction.reply({
        content: _("user_not_found"),
      });

    if (!serverUser.roles.cache.has(role))
      return await interaction.reply({
        content: _("no_roles_found_for_the_user_to_remove"),
      });

    try {
      await serverUser.roles.remove(role);
      return await interaction.reply({
        content: _("role_removed"),
      });
    } catch (error) {
      return await interaction.reply({
        content: _("role_could_not_removed"),
      });
    }
  },
};
