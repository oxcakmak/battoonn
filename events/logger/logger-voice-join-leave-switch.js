const { LoggerConfigs } = require("../../database/schemas");
const { _ } = require("../../utils/localization");
const { formattedCurrentDateTime } = require("../../utils/dateFunctions");

module.exports = {
  name: "voiceStateUpdate",
  async execute(oldState, newState) {
    const { guild } = newState;

    const serverId = guild.id;

    const LoggerConfigsQuery = await LoggerConfigs.findOne({
      server: serverId,
    });

    if (LoggerConfigsQuery && LoggerConfigsQuery.moduleEnabled) {
      try {
        const channel = await guild.channels.fetch(LoggerConfigsQuery.channel);
        if (channel) {
          if (!oldState.channelId && newState.channelId) {
            if (
              (!oldState.streaming && newState.streaming) ||
              (oldState.streaming && !newState.streaming) ||
              (!oldState.serverDeaf && newState.serverDeaf) ||
              (oldState.serverDeaf && !newState.serverDeaf) ||
              (!oldState.serverMute && newState.serverMute) ||
              (oldState.serverMute && !newState.serverMute) ||
              (!oldState.selfDeaf && newState.selfDeaf) ||
              (oldState.selfDeaf && !newState.selfDeaf) ||
              (!oldState.selfMute && newState.selfMute) ||
              (oldState.selfMute && !newState.selfMute) ||
              (!oldState.selfVideo && newState.selfVideo) ||
              (oldState.selfVideo && !newState.selfVideo)
            )
              return;

            return await channel.send({
              embeds: [
                {
                  title: "Joined the voice channel",
                  description:
                    "**User:** <@" +
                    newState.member.user.id +
                    "> - " +
                    newState.member.user.id +
                    "\n**Channel**: <#" +
                    newState.channelId +
                    "> - " +
                    newState.channelId +
                    "\n\n**[WHEN]**\n\n" +
                    "**Date/Time:** " +
                    formattedCurrentDateTime(),
                },
              ],
            });
          } else if (oldState.channelId && !newState.channelId) {
            if (
              (!oldState.streaming && newState.streaming) ||
              (oldState.streaming && !newState.streaming) ||
              (!oldState.serverDeaf && newState.serverDeaf) ||
              (oldState.serverDeaf && !newState.serverDeaf) ||
              (!oldState.serverMute && newState.serverMute) ||
              (oldState.serverMute && !newState.serverMute) ||
              (!oldState.selfDeaf && newState.selfDeaf) ||
              (oldState.selfDeaf && !newState.selfDeaf) ||
              (!oldState.selfMute && newState.selfMute) ||
              (oldState.selfMute && !newState.selfMute) ||
              (!oldState.selfVideo && newState.selfVideo) ||
              (oldState.selfVideo && !newState.selfVideo)
            )
              return;
            return await channel.send({
              embeds: [
                {
                  title: "Left the voice channel",
                  description:
                    "**User:** <@" +
                    newState.member.user.id +
                    "> - " +
                    newState.member.user.id +
                    "\n**Channel**: <#" +
                    oldState.channelId +
                    "> - " +
                    oldState.channelId +
                    "\n\n**[WHEN]**\n\n" +
                    "**Date/Time:** " +
                    formattedCurrentDateTime(),
                },
              ],
            });
          } else if (oldState.channelId && newState.channelId) {
            if (
              (!oldState.streaming && newState.streaming) ||
              (oldState.streaming && !newState.streaming) ||
              (!oldState.serverDeaf && newState.serverDeaf) ||
              (oldState.serverDeaf && !newState.serverDeaf) ||
              (!oldState.serverMute && newState.serverMute) ||
              (oldState.serverMute && !newState.serverMute) ||
              (!oldState.selfDeaf && newState.selfDeaf) ||
              (oldState.selfDeaf && !newState.selfDeaf) ||
              (!oldState.selfMute && newState.selfMute) ||
              (oldState.selfMute && !newState.selfMute) ||
              (!oldState.selfVideo && newState.selfVideo) ||
              (oldState.selfVideo && !newState.selfVideo)
            )
              return;
            return await channel.send({
              embeds: [
                {
                  title: "Switched Voice Channel",
                  description:
                    "**User:** <@" +
                    newState.member.user.id +
                    "> - " +
                    newState.member.user.id +
                    "\n**Before**: <#" +
                    oldState.channelId +
                    "> - " +
                    oldState.channelId +
                    "\n**After:** <#" +
                    newState.channelId +
                    "> - " +
                    newState.channelId +
                    "\n\n**[WHEN]**\n\n" +
                    "**Date/Time:** " +
                    formattedCurrentDateTime(),
                },
              ],
            });
          }
        }
      } catch (error) {
        console.error("Error fetching channel:", error);
      }
    }
  },
};
