const { LoggerConfigs } = require("../../database/schemas");
const { _ } = require("../../utils/localization");
const {
  formattedCurrentDateTime,
  timestampToFormattedDateTime,
} = require("../../utils/dateFunctions");
const ascii = require("ascii-table");

module.exports = {
  name: "messageDeleteBulk",
  async execute(messages) {
    const firstMessage = messages.first();
    const server = firstMessage.guild;

    if (firstMessage && server) {
      const LoggerConfigsQuery = await LoggerConfigs.findOne({
        server: server.id,
      });

      if (LoggerConfigsQuery && LoggerConfigsQuery.moduleEnabled) {
        try {
          const channel = await server.channels.fetch(
            LoggerConfigsQuery.channel
          );
          if (channel) {
            let messageList;
            messages.forEach(async (message) => {
              const messageChannel = message.channel
                ? message.channel
                : await message.guild.channels.fetch(message.channelId);

              messageList +=
                "\n\n**Channel**: " +
                messageChannel.name +
                ` (${message.channelId})` +
                "\n**Author**: " +
                message.author.username +
                ` (${message.author.id})` +
                "\n**Created Date/Time**: " +
                timestampToFormattedDateTime(message.createdTimestamp) +
                "\n**Content:** \n" +
                `\`${message.content}\``;
            });
            return await channel.send({
              embeds: [
                {
                  title: "Bulk Message Deleted",
                  description:
                    "**Count:** " +
                    messages.size +
                    (messageList && messageList + "\n") +
                    "\n**[WHEN]**\n\n" +
                    "**Date/Time:** " +
                    formattedCurrentDateTime(),
                },
              ],
            });
          }
        } catch (error) {
          console.error("Error fetching channel:", error);
        }
      }
    }
  },
};
