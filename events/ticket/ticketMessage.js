const { Tickets, TicketConfigs } = require("../../database/schemas");
const { _ } = require("../../utils/localization");
const { formattedCurrentDateTime } = require("../../utils/dateFunctions");

module.exports = {
  name: "messageCreate",
  async execute(message) {
    // Check if the author of the message is a bot, and if it's a bot, return early
    if (message.author.bot) return;

    const channelId = message.channel.id;
    const serverId = message.guild.id;

    const TicketConfigsQuery = await TicketConfigs.findOne({
      server: serverId,
    });

    if (TicketConfigsQuery && message.channel.name.startsWith("ticket-")) {
      if (!TicketConfigsQuery.moduleEnabled)
        return await message.reply({
          content: _("activate_module_first"),
          ephemeral: true,
        });

      const TicketsQuery = await Tickets.findOne({
        server: serverId,
        ticketId: channelId,
        isPost: false,
      });

      if (TicketsQuery && channelId === TicketsQuery.ticketId) {
        const createTickets = await new Tickets({
          server: serverId,
          ticketId: channelId,
          ticket: message.channel.name,
          content: message.content,
          isPost: true,
          createdBy: message.author.id,
          createdAt: formattedCurrentDateTime,
        });

        await createTickets.save();
      }

      /*
    if (message.channel.name.startsWith("t-")) {
      // Extract relevant data from the message
      const messageContent = await message.content;
      const senderId = await message.author.id;
      const timeStamp = formattedCurrentDateTime;
      const ticketId = await message.channel.name.split("-")[1];
    }
    */
    }
  },
};
