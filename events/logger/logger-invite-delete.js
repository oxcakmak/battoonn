const { LoggerConfigs } = require("../../database/schemas");
const { _ } = require("../../utils/localization");
const { formattedCurrentDateTime } = require("../../utils/dateFunctions");

module.exports = {
  name: "inviteDelete",
  async execute(invite) {
    const LoggerConfigsQuery = await LoggerConfigs.findOne({
      server: invite.guild.id,
    });

    if (LoggerConfigsQuery && LoggerConfigsQuery.moduleEnabled) {
      try {
        const channel = await invite.guild.channels.fetch(
          LoggerConfigsQuery.channel
        );
        if (channel) {
          return await channel.send({
            embeds: [
              {
                title: "Invite Deleted",
                description:
                  "**Code:** " +
                  invite.code +
                  "\n**Channel**: " +
                  invite.channel?.name +
                  "\n**Channel ID**: " +
                  invite.channel?.id +
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
