const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const { Explorer } = require("../../database/schemas/explorer");
const { Configs } = require("../../database/schemas/config");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("explorer")
    .setDescription(_("server_join_and_leave_member_transactions"))
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription(_("process_type"))
        .addChoices(
          { name: _("joining"), value: "join" },
          { name: _("leaving"), value: "leave" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("module")
        .setDescription(_("explorer_module_related_to_members"))
        .addChoices(
          { name: _("enable"), value: "true" },
          { name: _("disable"), value: "false" }
        )
    )
    .addStringOption((option) =>
      option.setName("message").setDescription(_("joining_or_leaving_mesage"))
    )
    .addRoleOption((option) =>
      option.setName("role").setDescription(_("server_given_joining_role"))
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription(
          _("chanel_notifications_send_to_joining_or_leaving_message")
        )
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
    const explorerQuery = await Explorer.findOne({ server: serverId });
    const explorerType = interaction.options.getString("type");
    const moduleEnabled = interaction.options.getString("module");
    const message = interaction.options.getString("message");
    const givenRole = interaction.options.getRole("role");
    const notifyChannel = interaction.options.getChannel("channel");

    const checkRegisteredServer = await Configs.findOne({ server: serverId });

    if (!checkRegisteredServer)
      return await interaction.reply({
        content: _("register_the_server_first"),
      });

    if (!explorerQuery) {
      const newExplorer = new Explorer({
        server: serverId,
        moduleEnabled: false,
        givenRole: null,
        notifyChannel: null,
        joinMessage: null,
        leaveMessage: null,
      });

      const savedExplorer = await newExplorer.save();

      if (!savedExplorer)
        return await interaction.reply({
          content: _("explorer_registration_failed"),
          ephemeral: true,
        });

      return await interaction.reply({
        content: _("explorer_registration_successful"),
        ephemeral: true,
      });
    }

    if (!moduleEnabled && !explorerQuery.moduleEnabled)
      return await interaction.reply({
        content: _("activate_module_first"),
        ephemeral: true,
      });

    if (moduleEnabled) {
      explorerQuery.moduleEnabled = moduleEnabled;
    }
    if (givenRole) {
      explorerQuery.givenRole = givenRole.id;
    }
    if (notifyChannel) {
      explorerQuery.notifyChannel = notifyChannel.id;
    }
    if (explorerType && message)
      switch (explorerType) {
        case "join":
          explorerQuery.joinMessage = message;
          break;
        case "leave":
          explorerQuery.leaveMessage = message;
          break;
      }

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
