const { LoggerConfigs } = require("../../database/schemas");
const { _ } = require("../../utils/localization");
const { formattedCurrentDateTime } = require("../../utils/dateFunctions");

module.exports = {
  name: "ready",
  async execute(client) {
    // console.log(client);
    /*
    const LoggerConfigsQuery = await LoggerConfigs.findOne({
      server: client.guild.id,
    });

    if (LoggerConfigsQuery && LoggerConfigsQuery.moduleEnabled) {
      try {
        const channel = await client.guild.channels.fetch(LoggerConfigsQuery.channel);
        if (channel) {
          return await channel.send({
            embeds: [
              {
                title: "User kicked from the voice channel",
                description:
                  "**User:** " +
                  target +
                  "\n**Channel**: " +
                  target +
                  "\n**Detail**: " +
                  target +
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
    */
  },
};
