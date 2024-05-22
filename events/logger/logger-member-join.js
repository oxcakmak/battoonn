const { LoggerConfigs } = require("../../database/schemas");
const { _ } = require("../../utils/localization");
const {
  formattedCurrentDateTime,
  timestampToFormattedDateTime,
} = require("../../utils/dateFunctions");

module.exports = {
  name: "guildMemberAdd",
  async execute(member) {
    const user = member.user;

    const LoggerConfigsQuery = await LoggerConfigs.findOne({
      server: member.guild.id,
    });

    if (LoggerConfigsQuery && LoggerConfigsQuery.moduleEnabled) {
      try {
        const channel = await member.guild.channels.fetch(
          LoggerConfigsQuery.channel
        );
        if (channel) {
          return await channel.send({
            embeds: [
              {
                title: "User Joined",
                description:
                  "**Username:** " +
                  user.username +
                  "\n**ID**: " +
                  user.id +
                  "\n**Type**: " +
                  (user.bot ? "Bot" : "User") +
                  "\n\n**[WHEN]**\n\n" +
                  "**Joined Timestamp:** " +
                  timestampToFormattedDateTime(member.joinedTimestamp) +
                  "\n**Date/Time:** " +
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