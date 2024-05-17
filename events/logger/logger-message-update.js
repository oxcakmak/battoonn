const { _ } = require("../../utils/localization");
const { formattedCurrentDateTime } = require("../../utils/dateFunctions");

module.exports = {
  name: "messageUpdate",
  once: true,
  async execute(oldMessage, newMessage) {
    if (!newMessage.guild) return;

    // Check if the message author is the bot
    if (newMessage.author.id === client.user.id) {
      console.log(`Bot edited a message: ${newMessage.content}`);
      return;
    }

    // Check for admin/moderator role
    const member = await newMessage.guild.members.fetch(newMessage.author.id);
    const roles = ["Admin", "Moderator"]; // Role names you consider as admin or moderator
    const hasRole = member.roles.cache.some((role) =>
      roles.includes(role.name)
    );

    if (hasRole) {
      console.log(`Admin/Moderator edited a message: ${newMessage.content}`);
    }
    // console.log(`${formattedCurrentDateTime()} | ${client.user.username} is now online.`);
  },
};
