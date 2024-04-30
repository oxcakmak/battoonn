const {
  PermissionsBitField,
  SlashCommandBuilder,
  ChannelType,
} = require("discord.js");
const { Configs, Explorers } = require("../../database/schemas");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("explorer-channel")
    .setDescription(
      _("chanel_notifications_send_to_joining_or_leaving_message")
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription(
          _("chanel_notifications_send_to_joining_or_leaving_message")
        )
        .addChannelTypes(ChannelType.GuildText)
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

    const notifyChannel = interaction.options.getChannel("channel");

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

    explorerQuery.notifyChannel = notifyChannel.id;

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
