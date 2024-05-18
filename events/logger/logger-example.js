const { LoggerConfigs } = require("../../database/schemas");
const { _ } = require("../../utils/localization");
const { formattedCurrentDateTime } = require("../../utils/dateFunctions");

module.exports = {
  name: "ready",
  async execute(client) {
    // console.log(client);
    /*
    const LoggerConfigsQuery = await LoggerConfigs.findOne({
      server: client,
    });

    if (LoggerConfigsQuery && LoggerConfigsQuery.moduleEnabled) {
      try {
        const channel = await client.channels.fetch(LoggerConfigsQuery.channel);
        if (channel) {
          await channel.send({
            embeds: [
              {
                title: "User kicked from the voice channel",
                description:
                  "**User:** <@" +
                  target +
                  "> - " +
                  target +
                  "\n**Channel**: <#" +
                  target +
                  "> - " +
                  target +
                  "\n**Detail**: " +
                  target +
                  " - " +
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
