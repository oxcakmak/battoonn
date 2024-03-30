const {
  PermissionsBitField,
  SlashCommandBuilder,
  ChannelType,
} = require("discord.js");
const { Configs, Explorers } = require("../../database/schemas");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("explorer-auto-rename")
    .setDescription(_("adds_tags_the_beginning_end_of_username"))
    .addStringOption((option) =>
      option
        .setName("position")
        .setDescription(_("where_to_add_tags"))
        .addChoices(
          { name: _("beginning_of_username"), value: "per" },
          { name: _("end_of_username"), value: "end" }
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("tag")
        .setDescription(_("what_tag_should_you_add"))
        .setRequired(true)
        .setMaxLength(25)
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

    const position = interaction.options.getString("position");
    const tag = interaction.options.getString("tag");

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

    explorerQuery.autoTag = tag;
    explorerQuery.autoTagPosition = position;

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
