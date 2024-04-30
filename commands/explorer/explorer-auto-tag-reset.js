const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const { Configs, Explorers } = require("../../database/schemas");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("explorer-auto-tag-reset")
    .setDescription(_("adds_tags_the_beginning_end_of_username")),
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

    const explorerQuery = await Explorers.findOne({ server: serverId });

    if (!explorerQuery)
      return await interaction.reply({
        content: _("register_as_an_explorer"),
        ephemeral: true,
      });

    explorerQuery.autoTag = null;
    explorerQuery.autoTagPosition = null;

    const savedExplorer = await explorerQuery.save();

    if (!savedExplorer)
      return await interaction.reply({
        content: _("explorer_settings_updated_failed"),
      });

    return await interaction.reply({
      content: _("explorer_settings_updated_success"),
    });
  },
};
