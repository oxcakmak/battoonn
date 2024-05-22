const { LoggerConfigs } = require("../../database/schemas");
const { _ } = require("../../utils/localization");
const { formattedCurrentDateTime } = require("../../utils/dateFunctions");

module.exports = {
  name: "stickerDelete",
  async execute(sticker) {
    console.log(sticker);
    const LoggerConfigsQuery = await LoggerConfigs.findOne({
      server: sticker.guild.id,
    });

    if (LoggerConfigsQuery && LoggerConfigsQuery.moduleEnabled) {
      try {
        const channel = await sticker.guild.channels.fetch(
          LoggerConfigsQuery.channel
        );
        if (channel) {
          return await channel.send({
            embeds: [
              {
                title: "Sticker Deleted",
                description:
                  "**Name:** " +
                  sticker.name +
                  "\n**ID**: " +
                  sticker.id +
                  (sticker.description &&
                    "\n**Description**: " + sticker.description) +
                  (sticker.tags && "\n**Tags**: " + sticker.tags) +
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
