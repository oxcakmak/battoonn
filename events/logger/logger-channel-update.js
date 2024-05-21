const { LoggerConfigs } = require("../../database/schemas");
const { _ } = require("../../utils/localization");
const { formattedCurrentDateTime } = require("../../utils/dateFunctions");
const { discordChannelTypeDetector } = require("../../utils/discordFunctions");
const { NewsChannel } = require("discord.js");

module.exports = {
  name: "channelUpdate",
  async execute(oldChannel, newChannel) {
    console.log(oldChannel);
    console.log(newChannel);
    let updateType = "";

    const LoggerConfigsQuery = await LoggerConfigs.findOne({
      server: oldChannel.guild.id,
    });

    if (LoggerConfigsQuery && LoggerConfigsQuery.moduleEnabled) {
      try {
        const logChannel = await oldChannel.guild.channels.fetch(
          LoggerConfigsQuery.channel
        );
        if (logChannel) {
          if (oldChannel?.name != newChannel?.name) {
            updateType = "Name";
          } else if (oldChannel.type != newChannel.type) {
            updateType = "Type";
          } else if (oldChannel.topic != newChannel.topic) {
            updateType = "Topic";
          } else if (oldChannel?.rawPosition != newChannel?.rawPosition) {
            updateType = "Position";
          } else {
            updateType = "n/a";
          }
          return await logChannel.send({
            embeds: [
              {
                title: "Channel Updated - " + updateType,
                description:
                  "**Before Name:** " +
                  oldChannel?.name +
                  "\n**After Name**: " +
                  newChannel?.name +
                  "\n**ID**: " +
                  oldChannel.id +
                  "\n**Before Type:** " +
                  discordChannelTypeDetector(oldChannel.type) +
                  "\n**After Type:** " +
                  discordChannelTypeDetector(newChannel.type) +
                  (oldChannel?.topic &&
                    newChannel?.topic &&
                    "\n\n**Before Topic:** " +
                      `\`\`\`${oldChannel?.topic}\`\`\`` +
                      "\n**After Topic:** " +
                      `\`\`\`${newChannel?.topic}\`\`\``) +
                  "\n**Before Position**: " +
                  oldChannel?.rawPosition +
                  "\n**After Position**: " +
                  newChannel?.rawPosition +
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
