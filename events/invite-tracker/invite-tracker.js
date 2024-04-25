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

    // Fetch the most recent guild invites (up to 100)
    const invites = await guild.invites.fetch();

    // Find the invite that the member used to join (if any)
    const invite = invites.find(
      (inv) => inv.uses !== undefined && inv.uses > 0
    );

    const inviter = invite.inviter;

    if (invite && inviter) {
      if (InviteTrackerConfig && moduleEnabled && channel) {
        const targetChannel = await guild.channels.cache.get(channel);

        let inviterMessage = message
          ? message
              .replace("%member%", `<@${member.id}>`)
              .replace("%target%", `<@${inviter.id}>`)
              .replace("%code%", `${invite.code}`)
          : _("member_invited_target_with_code_variable", {
              member: `<@${member.id}>`,
              target: `<@${inviter.id}>`,
              code: `${invite.code}`,
            });

        await targetChannel.send(inviterMessage);
      }
    }
  },
};
