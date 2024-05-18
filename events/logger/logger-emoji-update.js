const { LoggerConfigs } = require("../../database/schemas");
const { _ } = require("../../utils/localization");
const { formattedCurrentDateTime } = require("../../utils/dateFunctions");

module.exports = {
  name: "emojiUpdate",
  async execute(oldEmoji, newEmoji) {
    const LoggerConfigsQuery = await LoggerConfigs.findOne({
      server: oldEmoji.guild.id,
    });

    if (LoggerConfigsQuery && LoggerConfigsQuery.moduleEnabled) {
      try {
        const channel = await oldEmoji.guild.channels.fetch(
          LoggerConfigsQuery.channel
        );
        if (channel) {
          await channel.send({
            embeds: [
              {
                title: "Emoji Updated",
                description:
                  "**Old Name**: " +
                  oldEmoji?.name +
                  "\n**New Name**: " +
                  newEmoji?.name +
                  "\n**ID**: " +
                  oldEmoji.id +
                  "\n**Url**: " +
                  oldEmoji?.imageURL() +
                  "\n\n**[WHEN]**\n\n" +
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
  },
};
