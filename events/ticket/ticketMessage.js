const { Tickets, TicketConfigs } = require("../../database/schemas");
const { _ } = require("../../utils/localization");

const time = new Date().toLocaleString("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

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

    if (TicketConfigsQuery && !TicketConfigsQuery.moduleEnabled)
      return await message.reply({
        content: _("activate_module_first"),
        ephemeral: true,
      });

    const TicketsQuery = await Tickets.findOne({
      server: serverId,
      ticketId: channelId,
      isPost: false,
    });

    if (
      (TicketsQuery && channelId === TicketsQuery.ticketId) ||
      message.channel.name.startsWith("ticket-")
    ) {
      const createTickets = await new Tickets({
        server: serverId,
        ticketId: channelId,
        ticket: message.channel.name,
        content: message.content,
        isPost: true,
        createdBy: message.author.id,
        createdAt: time,
      });

      await createTickets.save();
    }

    /*
    if (message.channel.name.startsWith("t-")) {
      // Extract relevant data from the message
      const messageContent = await message.content;
      const senderId = await message.author.id;
      const timeStamp = await getCurrentDateTime();
      const ticketId = await message.channel.name.split("-")[1];
    }
    */
  },
};