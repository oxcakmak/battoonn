const {
  PermissionsBitField,
  SlashCommandBuilder,
  ChannelType,
} = require("discord.js");
const { Configs } = require("../../database/schemas");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("config")
    .setDescription(_("server_join_and_leave_member_transactions"))
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription(_("channel_type"))
        .addChoices(
          { name: _("command"), value: "command" },
          { name: _("response"), value: "response" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("language")
        .setDescription(_("explorer_module_related_to_members"))
        .addChoices(
          { name: _("english_with_code"), value: "en" },
          { name: _("turkish_with_code"), value: "tr" }
        )
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription(_("command_response_channel"))
        .addChannelTypes(ChannelType.GuildText)
    ),
  async execute(interaction) {
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

    const channelType = interaction.options.getString("type");
    const displayLanguage = interaction.options.getString("language");
    const channel = interaction.options.getChannel("channel");

    const configsQuery = await Configs.findOne({ server: serverId });

    if (!configsQuery)
      return await interaction.reply({
        content: _("register_the_server_first"),
      });

    if (displayLanguage) configsQuery.displayLanguage = displayLanguage;

    if (channelType && channel)
      switch (channelType) {
        case "command":
          configsQuery.commandChannel = channelType.id;
          break;
        case "response":
          configsQuery.responseChannel = channelType.id;
          break;
      }

    if (channelType && channelType === "command" && !channel)
      configsQuery.commandChannel = null;
    if (channelType && channelType === "response" && !channel)
      configsQuery.responseChannel = null;

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
