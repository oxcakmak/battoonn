const { LoggerConfigs } = require("../../database/schemas");
const { _ } = require("../../utils/localization");
const {
  formattedCurrentDateTime,
  timestampToFormattedDateTime,
} = require("../../utils/dateFunctions");
const { discordChannelTypeDetector } = require("../../utils/discordFunctions");

module.exports = {
  name: "channelPinsUpdate",
  async execute(channel) {
    const LoggerConfigsQuery = await LoggerConfigs.findOne({
      server: channel.guild.id,
    });

    if (LoggerConfigsQuery && LoggerConfigsQuery.moduleEnabled) {
      try {
        const logChannel = await channel.guild.channels.fetch(
          LoggerConfigsQuery.channel
        );
        if (logChannel) {
          return await logChannel.send({
            embeds: [
              {
                title: "Channel Pins Update",
                description:
                  "**Name:** " +
                  channel?.name +
                  "\n**ID**: " +
                  channel.id +
                  "\n**Message ID**: " +
                  channel.lastMessageId +
                  "\n**Type:** " +
                  discordChannelTypeDetector(channel.type) +
                  "\n**Pinned at**: " +
                  timestampToFormattedDateTime(channel.lastPinTimestamp) +
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
