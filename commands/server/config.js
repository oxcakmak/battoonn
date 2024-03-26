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
        .setDescription(_("bots_language"))
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
    if (interaction.bot) return;

    // Command description
    if (interaction.options.data.length === 0)
      return await interaction.reply({
        embeds: [
          {
            type: "rich",
            title: _("config_command"),
            description: _("command_to_update_server"),
            color: 0xffffff,
            fields: [
              {
                name: _("use_of"),
                value: `**type (command/response)**: ${_(
                  "channel_type"
                )} \n **language**: ${_("bots_language")} \n **channel**: ${_(
                  "command_response_channel"
                )}`,
              },
              {
                name: _("example"),
                value: `**/config language [tr/en]** \n **/config command #bot-command** \n **/config response #bot-command**`,
              },
              {
                name: _("attention"),
                value: `${_("channel_required_section")}`,
              },
            ],
          },
        ],
      });

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
