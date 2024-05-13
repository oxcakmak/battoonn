const { Explorers } = require("../../database/schemas");

module.exports = {
  name: "guildMemberAdd",
  async execute(member) {
    // Use the member object directly
    const guild = member.guild; // Access guild from member for clarity
    const serverId = guild.id;
    const explorer = await Explorers.findOne({ server: serverId });
    const {
      moduleEnabled,
      givenRole,
      notifyChannel,
      joinMessage,
      autoTag,
      autoTagPosition,
    } = explorer; // Destructuring

    if (explorer && moduleEnabled) {
      const role = await guild.roles.cache.get(givenRole);
      const channel = await guild.channels.cache.get(notifyChannel);
      const target = guild.members.cache.get(member.id);

      let message = joinMessage
        ? joinMessage.replace("%user%", `<@${member.id}>`)
        : _("member_join_message_default_variable", {
            user: `<@${member.id}>`,
          });

      if (givenRole && role) await member.roles.add(givenRole);

      if (channel && notifyChannel) await channel.send(message);

      if (autoTag && autoTagPosition) {
        const currentDisplayName = target.displayName;
        let newDisplayName = currentDisplayName;

        switch (autoTagPosition) {
          case "prepend":
            newDisplayName = autoTag + currentDisplayName;
            break;
          case "append":
            newDisplayName += autoTag;
            break;
          default:
            newDisplayName = currentDisplayName;
            break;
        }

        await target.setNickname(newDisplayName);
      }
    }
  },
};
