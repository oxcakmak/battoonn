const { SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("explorer")
    .setDescription(_("server_join_and_leave_member_transactions")),
  async execute(interaction) {
    if (interaction.bot) return;

    return await interaction.reply({
      embeds: [
        {
          type: "rich",
          title: _("explorer_command"),
          description: _("server_join_and_leave_member_transactions"),
          fields: [
            {
              name: _("commands"),
              value:
                "/explorer-module-enable \n /explorer-module-disable \n /explorer-channel `channel_or_channelId` \n /explorer-role `roleName_or_RoleId` \n /explorer-join-message `message` \n /explorer-leave-message `message` \n /explorer-auto-rename `poisition {per|end}` `tag` \n /explorer-reset",
            },
            {
              name: _("example"),
              value: _("user_code_tags"),
            },
          ],
        },
      ],
    });
  },
};
