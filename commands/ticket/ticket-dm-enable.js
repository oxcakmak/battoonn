const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const { Configs, TicketConfigs } = require("../../database/schemas");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket-dm-enable")
    .setDescription(
      "Allows sending transcript copy via DM when ticket is closed"
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

    const checkRegisteredServer = await Configs.findOne({ server: serverId });
    const ticketConfigsQuery = await TicketConfigs.findOne({
      server: serverId,
    });

    if (!checkRegisteredServer)
      return await interaction.reply({
        content: _("register_the_server_first"),
      });

    ticketConfigsQuery.sendDm = true;

    const ticketConfigsUpdate = await ticketConfigsQuery.save();
    if (!ticketConfigsUpdate)
      return await interaction.reply({
        content: _("an_unknown_error_occurred"),
        ephemeral: true,
      });

    return await interaction.reply({
      content: "Allowed to send transcript via private message",
    });
  },
};
