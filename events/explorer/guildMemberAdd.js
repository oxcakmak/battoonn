const { Explorers } = require("../../database/schemas");

module.exports = {
  name: "guildMemberAdd",
  async execute(member) {
    // Use the member object directly
    const guild = member.guild; // Access guild from member for clarity
    const serverId = guild.id;
    const explorer = await Explorers.findOne({ server: serverId });
    const { moduleEnabled, givenRole, notifyChannel, joinMessage } = explorer; // Destructuring

    if (explorer && moduleEnabled) {
      const role = await guild.roles.cache.get(givenRole);
      const channel = await guild.channels.cache.get(notifyChannel);

      if (givenRole && role) await member.roles.add(givenRole);

      if (channel && notifyChannel)
        await channel.send(joinMessage.replace("%user%", `<@${member.id}>`));
    }
  },
};
