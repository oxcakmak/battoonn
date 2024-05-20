const { ChannelType } = require("discord.js");
const { LoggerConfigs } = require("../../database/schemas");
const { _ } = require("../../utils/localization");
const {
  formattedCurrentDateTime,
  timestampToFormattedDateTime,
} = require("../../utils/dateFunctions");

module.exports = {
  name: "messageUpdate",
  async execute(oldMessage, newMessage) {
    // Ignore if the content hasn't changed
    if (oldMessage.content === newMessage.content) return;
    if (oldMessage.author && oldMessage.author.bot) return;
    if (newMessage.author && newMessage.author.bot) return;
    if (oldMessage.channel.type !== ChannelType.GuildText) return;
    if (newMessage.channel.type !== ChannelType.GuildText) return;

    const oldMessageData = oldMessage.reactions.message;
    const newMessageData = newMessage.reactions.message;

    const LoggerConfigsQuery = await LoggerConfigs.findOne({
      server: oldMessage.guildId,
    });

    if (LoggerConfigsQuery && LoggerConfigsQuery.moduleEnabled) {
      try {
        const channel = await oldMessage.guild.channels.fetch(
          LoggerConfigsQuery.channel
        );
        if (channel) {
          const oldChannelId = oldMessageData.channelId;
          const oldAuthorId = oldMessageData.author.id;
          // const oldAuthorUsername = oldMessageData.author.username;
          const oldContent = oldMessage.content.trim();
          const oldCreatedTimestamp = oldMessageData.createdTimestamp;

          const newChannelId = newMessageData.channelId;
          const newAuthorId = newMessageData.author.id;
          // const newAuthorUsername = newMessageData.author.username;
          const newContent = newMessage.content.trim();
          const newEditedTimestamp = newMessageData.editedTimestamp;

          return await channel.send({
            embeds: [
              {
                title: "Message Updated",
                description:
                  "**[BEFORE]**\n\n**Author:** <@" +
                  oldAuthorId +
                  "> - " +
                  oldAuthorId +
                  "\n**Channel**: <#" +
                  oldChannelId +
                  "> - " +
                  oldChannelId +
                  "\n**Content:**" +
                  `\`\`\`${oldContent}\`\`\`` +
                  (oldMessageData.attachments.length > 0
                    ? "**Attachment(s):** " +
                      `\`\`\`${[...oldMessageData.attachments.values()]
                        .map((x) => x.proxyURL)
                        .join("\n\n")}\`\`\``
                    : "") +
                  "\n**[AFTER]**\n\n**Author:** <@" +
                  newAuthorId +
                  "> - " +
                  newAuthorId +
                  "\n**Channel**: <#" +
                  newChannelId +
                  "> - " +
                  newChannelId +
                  "\n**Content:**" +
                  `\`\`\`${newContent}\`\`\`` +
                  (newMessageData.attachments.length > 0
                    ? "**Attachment(s):** " +
                      `\`\`\`${[...newMessageData.attachments.values()]
                        .map((x) => x.proxyURL)
                        .join("\n\n")}\`\`\`` +
                      "\n"
                    : "") +
                  "\n**[WHEN]**\n\n" +
                  "**Created**: " +
                  timestampToFormattedDateTime(oldCreatedTimestamp) +
                  "\n**Edited**: " +
                  timestampToFormattedDateTime(newEditedTimestamp) +
                  "\n**Date/Time:** " +
                  formattedCurrentDateTime(),
              },
            ],
          });
        }
      } catch (error) {
        console.log("Error fetching channel:", error);
      }
    }
  },
};
