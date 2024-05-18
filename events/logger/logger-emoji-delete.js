const { LoggerConfigs } = require("../../database/schemas");
const { _ } = require("../../utils/localization");
const { formattedCurrentDateTime } = require("../../utils/dateFunctions");

module.exports = {
  name: "emojiDelete",
  async execute(emoji) {
    const LoggerConfigsQuery = await LoggerConfigs.findOne({
      server: emoji.guild.id,
    });

    if (LoggerConfigsQuery && LoggerConfigsQuery.moduleEnabled) {
      try {
        const channel = await emoji.guild.channels.fetch(
          LoggerConfigsQuery.channel
        );
        if (channel) {
          await channel.send({
            embeds: [
              {
                title: "Emoji Deleted",
                description:
                  "**Name**: " +
                  emoji?.name +
                  "\n**ID**: " +
                  emoji.id +
                  "\n**Url**: " +
                  emoji?.imageURL() +
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
