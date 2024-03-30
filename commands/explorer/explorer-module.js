const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const { Configs, Explorers } = require("../../database/schemas");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("explorer-module")
    .setDescription(_("explorer_module_related_to_members"))
    .addStringOption((option) =>
      option
        .setName("module")
        .setDescription(_("explorer_module_related_to_members"))
        .addChoices(
          { name: _("enable"), value: "true" },
          { name: _("disable"), value: "false" }
        )
        .setRequired(true)
    ),
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

    const serverId = interaction.guild.id;

    const moduleEnabled = interaction.options.getString("module");

    const checkRegisteredServer = await Configs.findOne({ server: serverId });
    const explorerQuery = await Explorers.findOne({ server: serverId });

    if (!checkRegisteredServer)
      return await interaction.reply({
        content: _("register_the_server_first"),
      });

    if (!explorerQuery)
      return await interaction.reply({
        content: _("register_as_an_explorer"),
        ephemeral: true,
      });

    if (!explorerQuery.moduleEnabled)
      return await interaction.reply({
        content: _("activate_module_first"),
        ephemeral: true,
      });

    explorerQuery.moduleEnabled = moduleEnabled;

    const explorerUpdate = await explorerQuery.save();
    if (!explorerUpdate)
      return await interaction.reply({
        content: _("explorer_settings_updated_failed"),
        ephemeral: true,
      });

    return await interaction.reply({
      content: _("explorer_settings_updated_success"),
    });
  },
};
