const { AuditLogEvent, PermissionsBitField } = require("discord.js");
const { LoggerConfigs } = require("../../database/schemas");
const { _ } = require("../../utils/localization");
const {
  formattedCurrentDateTime,
  timestampToFormattedDateTime,
} = require("../../utils/dateFunctions");

module.exports = {
  name: "messageDelete",
  async execute(message) {
    if (!message.guild) return;

    const LoggerConfigsQuery = await LoggerConfigs.findOne({
      server: message.guild.id,
    });

    if (LoggerConfigsQuery && LoggerConfigsQuery.moduleEnabled) {
      try {
        const channel = await message.guild.channels.fetch(
          LoggerConfigsQuery.channel
        );

        if (!channel) return;

        const deletedBy = await message.guild.members.cache.get(
          message.author?.id
        );

        if (deletedBy && deletedBy.user.bot) return; // Ignore bot deletions

        return await channel.send({
          embeds: [
            {
              title: "Message Deleted",
              description:
                "**User:** <@" +
                message.author.id +
                "> - " +
                message.author.id +
                "\n**Channel**: <#" +
                message.channelId +
                "> -  " +
                message.channelId +
                "\n**Content:**" +
                `\`\`\`${message.content}\`\`\`` +
                "\n**[WHEN]**\n\n" +
                "**Created:** " +
                timestampToFormattedDateTime(message.createdTimestamp) +
                "\n**Date/Time:** " +
                formattedCurrentDateTime(),
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching channel:", error);
      }
    }
  },
};
