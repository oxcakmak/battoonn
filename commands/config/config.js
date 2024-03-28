const { SlashCommandBuilder, ChannelType } = require("discord.js");
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
              name: _("usage"),
              value:
                "/config-language `en` \n /config-command `#bot-command` \n /config-response `#bot-command`",
            },
          ],
        },
      ],
    });
  },
};
