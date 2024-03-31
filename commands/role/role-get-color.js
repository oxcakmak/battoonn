const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("role-get-color")
    .setDescription(_("return_color_code_of_the_role"))
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription(_("filter_by_role"))
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

    const role = interaction.options.getRole("role").id;

    const serverRole = interaction.guild.roles.cache.get(role);

    if (!role)
      return await interaction.reply({
        content: _("role_not_found"),
      });

    return await interaction.reply({
      content: _("color_of_the_role_you_choose_with_color_variable", {
        color: "`" + serverRole.color + "`",
      }),
    });
  },
};
