const { SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("config")
    .setDescription(_("server_join_and_leave_member_transactions")),
  async execute(interaction) {
    if (interaction.bot) return;

    return await interaction.reply({
      embeds: [
        {
          type: "rich",
          title: _("config_command"),
          description: _("command_to_update_server"),
          fields: [
            {
              name: _("commands"),
              value:
                "/config-language `language` \n /config-command-channel `channel` \n /config-response-channel `channel` \n /config-announcement-channel `channel` \n /config-allow-channel `channel` \n /config-forum-role `role` \n /config-forum-solved-title `title`",
            },
          ],
        },
      ],
    });
  },
};
