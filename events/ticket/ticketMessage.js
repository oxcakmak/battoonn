const { Configs } = require("../../database/schemas");
const { _ } = require("../../utils/localization");

const shortdate = require("shortdate");
const today = shortdate(new Date(), {
  sep: "",
});

module.exports = {
  name: "messageCreate",
  async execute(message) {
    // Check if the author of the message is a bot, and if it's a bot, return early
    if (message.author.bot) return;

    const serverId = message.channel.id;

    if (message.channel.name.startsWith("t-")) {
      // Extract relevant data from the message
      const messageContent = await message.content;
      const senderId = await message.author.id;
      const timeStamp = await getCurrentDateTime();
      const ticketId = await message.channel.name.split("-")[1];
    }
  },
};
