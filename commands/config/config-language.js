const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const { Configs } = require("../../database/schemas");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("config-language")
    .setDescription(_("changes_the_bot_language"))
    .addStringOption((option) =>
      option
        .setName("module")
        .setDescription(_("explorer_module_related_to_members"))
        .addChoices(
          { name: _("english_with_code"), value: "en" },
          { name: _("turkish_with_code"), value: "tr" }
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

    const serverId = await interaction.guild.id;

    const language = interaction.options.getChannel("language");

    const configsQuery = await Configs.findOne({ server: serverId });

    if (!configsQuery)
      return await interaction.reply({
        content: _("register_the_server_first"),
      });

    if (!language) configsQuery.displayLanguage = "en";

    configsQuery.displayLanguage = language;

    const configsUpdate = await configsQuery.save();
    if (!configsUpdate)
      return await interaction.reply({
        content: _("server_settings_update_failed"),
        ephemeral: true,
      });

    return await interaction.reply({
      content: _("server_settings_update_success"),
    });
  },
};
