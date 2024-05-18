const { LoggerConfigs } = require("../../database/schemas");
const { _ } = require("../../utils/localization");
const { formattedCurrentDateTime } = require("../../utils/dateFunctions");

module.exports = {
  name: "roleUpdate",
  async execute(oldRole, newRole) {
    const LoggerConfigsQuery = await LoggerConfigs.findOne({
      server: oldRole.guild.id,
    });

    if (LoggerConfigsQuery && LoggerConfigsQuery.moduleEnabled) {
      try {
        const channel = await oldRole.guild.channels.fetch(
          LoggerConfigsQuery.channel
        );
        if (channel) {
          if (oldRole?.name !== newRole?.name) {
            return await channel.send({
              embeds: [
                {
                  title: "Role Name Updated",
                  description:
                    "**ID:** " +
                    oldRole.id +
                    "\n**Before Name:** " +
                    oldRole?.name +
                    "\n**After Name:** " +
                    newRole?.name +
                    "\n**Before Color**: " +
                    oldRole.color.toString(16) +
                    "\n**After Color**: " +
                    newRole.color.toString(16) +
                    "\n\n**[WHEN]**\n\n" +
                    "**Date/Time:** " +
                    formattedCurrentDateTime(),
                },
              ],
            });
          } else if (oldRole.color !== newRole.color) {
            return await channel.send({
              embeds: [
                {
                  title: "Role Color Updated",
                  description:
                    "**ID:** " +
                    oldRole.id +
                    "\n**Before Name:** " +
                    oldRole?.name +
                    "\n**After Name:** " +
                    newRole?.name +
                    "\n**Before Color**: " +
                    oldRole.color.toString(16) +
                    "\n**After Color**: " +
                    newRole.color.toString(16) +
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
