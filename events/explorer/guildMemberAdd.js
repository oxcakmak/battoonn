const { Explorers } = require("../../database/schemas");

module.exports = {
  name: "guildMemberAdd",
  async execute(member) {
    // Use the member object directly
    const guild = member.guild; // Access guild from member for clarity
    const serverId = guild.id;
    const explorer = await Explorers.findOne({ server: serverId });

    if (explorer && explorer.moduleEnabled) {
      const { givenRole, notifyChannel, joinMessage } = explorer; // Destructuring
      const role = await guild.roles.cache.get(givenRole);
      const channel = await guild.channels.cache.get(notifyChannel);

      if (givenRole && role) await member.roles.add(givenRole);

      if (channel && notifyChannel)
        await channel.send(
          joinMessage
            ? joinMessage
            : _("member_join_message_default_variable", { user: member.id })
        );
    }
  },
};
