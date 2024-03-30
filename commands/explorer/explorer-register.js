const {
  PermissionsBitField,
  SlashCommandBuilder,
  ChannelType,
} = require("discord.js");
const { Configs, Explorers } = require("../../database/schemas");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("explorer-register")
    .setDescription(_("server_join_and_leave_member_transactions"))
    .addStringOption((option) =>
      option
        .setName("module")
        .setDescription(_("explorer_module_related_to_members"))
        .addChoices(
          { name: _("enable"), value: "true" },
          { name: _("disable"), value: "false" }
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("join")
        .setDescription(_("joining_or_leaving_mesage"))
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("leave")
        .setDescription(_("joining_or_leaving_mesage"))
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription(_("server_given_joining_role"))
        .setRequired(true)
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

    const serverId = interaction.guild.id;

    const moduleEnabled = interaction.options.getString("module");
    const join = interaction.options.getString("join");
    const leave = interaction.options.getString("leave");
    const givenRole = interaction.options.getRole("role");
    const notifyChannel = interaction.options.getChannel("channel");

    const checkRegisteredServer = await Configs.findOne({ server: serverId });
    const explorerQuery = await Explorers.findOne({ server: serverId });

    if (!checkRegisteredServer)
      return await interaction.reply({
        content: _("register_the_server_first"),
      });

    if (explorerQuery)
      return await interaction.reply({
        content: _("explorer_record_exists"),
        ephemeral: true,
      });

    const newExplorer = new Explorers({
      server: serverId,
      moduleEnabled: moduleEnabled,
      givenRole: givenRole.id,
      notifyChannel: notifyChannel.id,
      joinMessage: join,
      leaveMessage: leave,
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
  },
};
