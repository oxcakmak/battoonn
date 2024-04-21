const { t } = require("../../utils/localization");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    // Get the first guild ID from the bot's cache (adjust as needed)
    const guildId = client.guilds.cache.first().id;

    if (guildId) {
      console.log(`Guild ID: ${guildId}`);
    } else {
      console.log("Bot is not in any guilds.");
    }
    /*

    // Schedule birthday checks every day at midnight (adjust as needed)
    const schedule = "0 0 * * *"; // Cron expression for daily at midnight
    cron.schedule(schedule, async () => {
      const guild = client.guilds.cache.get("your_guild_id"); // Replace with your guild ID
      if (!guild) return console.error("Guild not found.");

      const members = await guild.members.fetch();
      for (const member of members.values()) {
        if (!member.user.bot) {
          // Avoid assigning roles to bots
          const birthday = member.user.birthday;
          if (birthday && isToday(birthday)) {
            try {
              const birthdayRole = await guild.roles.fetch(birthdayRoleId);
              await member.roles.add(birthdayRole);
              console.log(`Happy Birthday, ${member.user.tag}! `);

              // Optional: Send a birthday message in a specific channel
              if (birthdayChannelId) {
                const birthdayChannel = await guild.channels.fetch(
                  birthdayChannelId
                );
                if (birthdayChannel) {
                  await birthdayChannel.send(
                    `Happy Birthday, <@${member.user.id}>! `
                  );
                }
              }
            } catch (error) {
              console.error(
                `Error assigning birthday role to ${member.user.tag}:`,
                error
              );
            }
          }
        }
      }
    });*/

    // Helper function to check if a date is today
    function isToday(date) {
      const today = new Date();
      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth()
      );
    }
  },
};
