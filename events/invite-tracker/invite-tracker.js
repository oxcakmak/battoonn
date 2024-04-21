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
    const { channel, message } = InviteTrackerConfig; // Destructuring

    const fetchInvite = async () => {
      return await guild.invites
        .fetch()
        .then(
          async (invites) =>
            await invites.find(
              (invite) =>
                invite.uses > 0 &&
                (invitedBy.get(member.id) || {}).code === invite.code
            )
        );
    };

    const inviter = await fetchInvite();

    // Clear invitedBy information for the member after processing
    invitedBy.delete(member.id);

    if (InviteTrackerConfig && channel && inviter) {
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
  },
};
