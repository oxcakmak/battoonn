const { LoggerConfigs } = require("../../database/schemas");
const { _ } = require("../../utils/localization");
const { formattedCurrentDateTime } = require("../../utils/dateFunctions");

module.exports = {
  name: "stickerUpdate",
  async execute(oldSticker, newSticker) {
    const LoggerConfigsQuery = await LoggerConfigs.findOne({
      server: oldSticker.guild.id,
    });

    if (LoggerConfigsQuery && LoggerConfigsQuery.moduleEnabled) {
      try {
        const channel = await oldSticker.guild.channels.fetch(
          LoggerConfigsQuery.channel
        );
        if (channel) {
          return await channel.send({
            embeds: [
              {
                title: "Sticker Updated",
                description:
                  "**Before Name:** " +
                  oldSticker.name +
                  "\n**New Name:** " +
                  newSticker.name +
                  "\n**ID**: " +
                  oldSticker.id +
                  (oldSticker.description &&
                    "\n**Before Description**: " + oldSticker.description) +
                  (newSticker.description &&
                    "\n**New Description**: " + newSticker.description) +
                  (oldSticker.tags && "\n**Before Tags**: " + oldSticker.tags) +
                  (newSticker.tags && "\n**New Tags**: " + newSticker.tags) +
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
