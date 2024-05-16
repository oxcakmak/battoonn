const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const { InviteTrackerConfigs } = require("../../database/schemas");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("invite-tracker-message")
    .setDescription(_("notified_for_the_member_joining_the_server"))
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription(_("notified_for_the_member_joining_the_server"))
    ),
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

    const message = interaction.options.getString("message");

    const inviteTrackerConfig = await InviteTrackerConfigs.findOne({
      server: serverId,
    });

    if (!inviteTrackerConfig)
      return await interaction.reply({
        content: _("register_as_an_explorer"),
        ephemeral: true,
      });

    if (!inviteTrackerConfig.moduleEnabled)
      return await interaction.reply({
        content: _("activate_module_first"),
        ephemeral: true,
      });

    if (interaction.options.data.length === 0)
      return await interaction.reply({
        content: inviteTrackerConfig.message,
      });

    inviteTrackerConfig.message = message;

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
