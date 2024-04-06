const { SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("music")
    .setDescription(_("server_join_and_leave_member_transactions")),
  async execute(interaction) {
    if (interaction.bot) return;

    return await interaction.reply({
      embeds: [
        {
          type: "rich",
          title: _("music_command"),
          description: _("music_commands"),
          fields: [
            {
              name: _("commands"),
              value:
                "/mp `register` \n /mn \n /ms \n /music-register \n /music-jd `role` \n /music-config-spotify `clientId` `clientSecret` \n /music-channel `channel`",
            },
          ],
        },
      ],
    });
  },
};
