const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const { InviteTrackerConfigs } = require("../../database/schemas");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("it-module-disable")
    .setDescription(_("open_explorer_module")),
  async execute(interaction) {
    if (interaction.bot) return;

    // Check if the user has permission to manage messages
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

    inviteTrackerConfig.moduleEnabled = false;

    const inviteTrackerUpdate = await inviteTrackerConfig.save();
    if (!inviteTrackerUpdate)
      return await interaction.reply({
        content: _("explorer_settings_updated_failed"),
        ephemeral: true,
      });

    return await interaction.reply({
      content: _("explorer_settings_updated_success"),
    });
  },
};
