const { LoggerConfigs } = require("../../database/schemas");
const { _ } = require("../../utils/localization");
const { formattedCurrentDateTime } = require("../../utils/dateFunctions");

module.exports = {
  name: "roleDelete",
  async execute(role) {
    const LoggerConfigsQuery = await LoggerConfigs.findOne({
      server: role.guild.id,
    });

    if (LoggerConfigsQuery && LoggerConfigsQuery.moduleEnabled) {
      try {
        const channel = await role.guild.channels.fetch(
          LoggerConfigsQuery.channel
        );
        if (channel) {
          return await channel.send({
            embeds: [
              {
                title: "Role Deleted",
                description:
                  "**Name:** " +
                  role?.name +
                  "\n**ID:** " +
                  role.id +
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
