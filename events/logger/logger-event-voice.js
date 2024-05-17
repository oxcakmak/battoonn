const { AuditLogEvent } = require("discord.js");
const { LoggerConfigs } = require("../../database/schemas");
const { _ } = require("../../utils/localization");
const { formattedCurrentDateTime } = require("../../utils/dateFunctions");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    // Listen for the voiceStateUpdate event
    client.on("voiceStateUpdate", async (oldState, newState) => {
      const { member, guild } = newState;

      // Get the channels the member joined and left
      const joinedChannel = newState.channel;
      const leftChannel = oldState.channel;

      const serverId = guild.id;
      const user = member.user;

      const LoggerConfigsQuery = await LoggerConfigs.findOne({
        server: serverId,
      });

      if (LoggerConfigsQuery && LoggerConfigsQuery.moduleEnabled) {
        try {
          const channel = await client.channels.fetch(
            LoggerConfigsQuery.channel
          );
          if (channel) {
            if (leftChannel && !joinedChannel) {
              const auditLogs = await guild.fetchAuditLogs({
                type: AuditLogEvent.MemberKick,
                limit: 1,
              });
              const kickLog = auditLogs.entries.first();

              if (kickLog) {
                const { executor, target } = kickLog;
                // Ensure the log corresponds to the member who was kicked
                console.log(kickLog);
                if (target.id === user.id) {
                  await channel.send({
                    embeds: [
                      {
                        title: "User kicked from the voice channel",
                        description:
                          "**User:** " +
                          target.username +
                          " - " +
                          target.id +
                          "\n**By:** " +
                          executor.username +
                          " - " +
                          executor.id +
                          "\n**Channel**: " +
                          leftChannel.name +
                          " -  " +
                          leftChannel.id +
                          "\n**Timestamp:** " +
                          formattedCurrentDateTime(),
                      },
                    ],
                  });
                } else {
                  await channel.send({
                    embeds: [
                      {
                        title: "Left the voice channel",
                        description:
                          "**User:** " +
                          user.username +
                          " - " +
                          user.id +
                          "\n**Channel**: " +
                          leftChannel.name +
                          " -  " +
                          leftChannel.id +
                          "\n**Timestamp:** " +
                          formattedCurrentDateTime(),
                      },
                    ],
                  });
                }
              }
            }

            // Handle member joining a voice channel
            if (joinedChannel && !leftChannel)
              await channel.send({
                embeds: [
                  {
                    title: "Joined the voice channel",
                    description:
                      "**User:** " +
                      user.username +
                      " - " +
                      user.id +
                      "\n**Channel**: " +
                      joinedChannel.name +
                      " -  " +
                      joinedChannel.id +
                      "\n**Timestamp:** " +
                      formattedCurrentDateTime(),
                  },
                ],
              });

            /*
            // Handle member switching voice channels
            if (joinedChannel && leftChannel && joinedChannel !== leftChannel)
              await channel.send({
                embeds: [
                  {
                    title: "Switched Voice Channel",
                    description:
                      "**User:** " +
                      user.username +
                      " - " +
                      user.id +
                      "\n**Before**: " +
                      leftChannel.name +
                      " -  " +
                      leftChannel.id +
                      "\n**After:** " +
                      joinedChannel.name +
                      " - " +
                      joinedChannel.id +
                      "\n**Timestamp:** " +
                      formattedCurrentDateTime(),
                    color: null,
                    thumbnail: {
                      url: user.displayAvatarURL({ format: "jpg", size: 512 }),
                    },
                  },
                ],
              });
              */
          }
        } catch (error) {
          // console.error("Error fetching channel:", error);
        }
      }
    });
  },
};
