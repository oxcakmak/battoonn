const { LoggerConfigs } = require("../../database/schemas");
const { _ } = require("../../utils/localization");
const { formattedCurrentDateTime } = require("../../utils/dateFunctions");
const { discordChannelTypeDetector } = require("../../utils/discordFunctions");

module.exports = {
  name: "channelDelete",
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
                title: "Channel Deleted",
                description:
                  "**Name:** " +
                  channel?.name +
                  "\n**ID**: " +
                  channel.id +
                  "\n**Type:** " +
                  discordChannelTypeDetector(channel.type) +
                  "\n**Position**: " +
                  channel?.rawPosition +
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
