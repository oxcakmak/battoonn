const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const { InviteTrackerConfigs } = require("../../database/schemas");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("invite-tracker-module")
    .setDescription(_("open_explorer_module")),
  async execute(interaction) {
    if (interaction.bot) return;

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await interaction.reply({
        content: _("you_do_not_have_permission_command"),
        ephemeral: true,
      });

    const serverId = await interaction.guild.id;

    const inviteTrackerConfig = await InviteTrackerConfigs.findOne({
      server: serverId,
    });

    if (!inviteTrackerConfig)
      return await interaction.reply({
        content: _("register_as_an_explorer"),
        ephemeral: true,
      });

    return await interaction.reply({
      content: inviteTrackerConfig.moduleEnabled,
      ephemeral: true,
    });
  },
};
