const { InviteTrackerConfigs } = require("../../database/schemas");

module.exports = {
  name: "guildMemberAdd",
  async execute(member) {
    // Use the member object directly
    const guild = member.guild; // Access guild from member for clarity
    const serverId = guild.id;
    const InviteTrackerConfig = await InviteTrackerConfigs.findOne({
      server: serverId,
    });
    const { moduleEnabled, channel, message } = InviteTrackerConfig; // Destructuring

    console.log(await guild.invites.fetch());

    /*
    if (InviteTrackerConfig && moduleEnabled && channel) {
      const targetChannel = await guild.channels.cache.get(channel);

      let inviterMessage = message
        ? message
            .replace("%member%", `<@${member.user.username}>`)
            .replace("%target%", `<@${inviter.inviter.username}>`)
            .replace("%code%", `<@${inviter.code}>`)
        : _("member_invited_target_with_code_variable", {
            member: `<@${member.id}>`,
            target: `<@${inviter.inviter.username}>`,
            code: `<@${inviter.code}>`,
          });

      await targetChannel.send(inviterMessage);
    }
    */
  },
};
