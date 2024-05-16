const { Configs, CustomCommands } = require("../../database/schemas");
const { _ } = require("../../utils/localization");
const {
  startsWithPrefix,
  splitCommandString,
} = require("../../utils/stringFunctions");
const { clearEmptyArray } = require("../../utils/arrayFunctions");

module.exports = {
  name: "messageCreate",
  async execute(message) {
    // Check if the author of the message is a bot, and if it's a bot, return early
    if (message.author.bot) return;

    const channelId = message.channel.id;
    const serverId = message.guild.id;
    const content = message.content.trim();

    const splittedPrefixString = clearEmptyArray(splitCommandString(content));

    if (startsWithPrefix(content) && splittedPrefixString.length === 2) {
      const CustomCommand = await CustomCommands.findOne({
        server: serverId,
        prefix: splittedPrefixString[0],
        name: splittedPrefixString[1],
      });
      if (CustomCommand)
        return message.reply({ content: CustomCommand.response.toString() });
    }
  },
};
