const {
  PermissionsBitField,
  SlashCommandBuilder,
  ChannelType,
} = require("discord.js");
const { Configs, TicketConfigs } = require("../../database/schemas");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket-transcript-channel")
    .setDescription(_("transcript_channel"))
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription(
          _("send_conversation_recordings_channel_when_ticket_close")
        )
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
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

    const channel = interaction.options.getChannel("channel");

    const checkRegisteredServer = await Configs.findOne({ server: serverId });
    const ticketConfigsQuery = await TicketConfigs.findOne({
      server: serverId,
    });

    if (!checkRegisteredServer)
      return await interaction.reply({
        content: _("register_the_server_first"),
      });

    if (!ticketConfigsQuery) {
      const newTicketConfigs = new TicketConfigs({
        server: serverId,
        transcriptChannel: channel,
      });

      const savedTicketConfigs = await newTicketConfigs.save();

      if (!savedTicketConfigs)
        return await interaction.reply({
          content: _("ticket_settings_not_saved"),
          ephemeral: true,
        });

      return await interaction.reply({
        content: _("ticket_settings_saved"),
        ephemeral: true,
      });
    }

    if (!ticketConfigsQuery.moduleEnabled)
      return await interaction.reply({
        content: _("activate_module_first"),
        ephemeral: true,
      });

    ticketConfigsQuery.transcriptChannel = channel.id;

    const ticketConfigsUpdate = await ticketConfigsQuery.save();
    if (!ticketConfigsUpdate)
      return await interaction.reply({
        content: _("ticket_settings_not_updated"),
        ephemeral: true,
      });

    return await interaction.reply({
      content: _("ticket_settings_updated"),
    });
  },
};
