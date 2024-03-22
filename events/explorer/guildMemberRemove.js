const { Explorers } = require("../../database/schemas");

module.exports = {
  name: "guildMemberRemove",
  async execute(member) {
    // Use the member object directly
    const guild = member.guild; // Access guild from member for clarity
    const serverId = guild.id;
    const explorer = await Explorers.findOne({ server: serverId });
    const { moduleEnabled, notifyChannel, leaveMessage } = explorer; // Destructuring

    if (explorer && moduleEnabled) {
      const channel = await guild.channels.cache.get(notifyChannel);

      if (channel && notifyChannel)
        await channel.send(leaveMessage.replace("%user%", `<@${member.id}>`));
    }
  },
};
