const { LoggerConfigs } = require("../../database/schemas");
const { _ } = require("../../utils/localization");
const { formattedCurrentDateTime } = require("../../utils/dateFunctions");

module.exports = {
  name: "inviteCreate",
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
                title: "Invite Created",
                description:
                  "**Code:** " +
                  invite.code +
                  "\n**Inviter**: " +
                  invite.inviter?.username +
                  "\n**Inviter ID**: " +
                  invite.inviter?.id +
                  "\n**Max Uses**: " +
                  (invite.maxUses ? invite.maxUses : "Unlimited") +
                  "\n**Never Expires**: " +
                  (invite.maxAge === 0 ? "Yes" : "No") +
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
