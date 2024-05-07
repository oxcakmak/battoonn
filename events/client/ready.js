const { t } = require("../../utils/localization");
const { formattedCurrentDateTime } = require("../../utils/dateFunctions");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.log(
      `${formattedCurrentDateTime()} | ${client.user.username} is now online.`
    );
    //custom status of bot

    const activities = [
      {
        name: "/help",
        type: 0,
      },
    ];
    const customActivities = Math.floor(Math.random() * activities.length);

    client.user.setActivity(`${activities[customActivities].name}`, {
      type: activities[customActivities].type,
      status: "online",
    });

    // | ${client.guilds.cache.size} servers
  },
};
