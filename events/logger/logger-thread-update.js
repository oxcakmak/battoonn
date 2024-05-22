const { LoggerConfigs } = require("../../database/schemas");
const { _ } = require("../../utils/localization");
const { formattedCurrentDateTime } = require("../../utils/dateFunctions");

module.exports = {
  name: "threadUpdate",
  async execute(oldThread, newThread) {
    const LoggerConfigsQuery = await LoggerConfigs.findOne({
      server: oldThread.guild.id,
    });

    if (LoggerConfigsQuery && LoggerConfigsQuery.moduleEnabled) {
      try {
        const channel = await oldThread.guild.channels.fetch(
          LoggerConfigsQuery.channel
        );
        if (channel) {
          let title;
          let newThreadTitle;
          if (oldThread.name !== newThread.name) {
            title = "Updated";
            newThreadTitle = "\n**New Thread:** " + newThread.name;
          } else {
            if (newThread.archived !== oldThread.archived) {
              title = newThread.archived ? "Archived" : "Unarchived";
            } else if (newThread.locked !== oldThread.locked) {
              title = newThread.locked ? "Locked" : "Unlocked";
            }
          }
          return await channel.send({
            embeds: [
              {
                title: "Thread " + title,
                description:
                  "**Old Thread:** " +
                  oldThread?.name +
                  (newThreadTitle ? newThreadTitle : "") +
                  "\n**ID**: " +
                  oldThread.id +
                  "\n**Author**: " +
                  oldThread?.ownerId +
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
