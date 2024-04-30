const { SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("giveaway")
    .setDescription(_("role_command")),
  async execute(interaction) {
    if (interaction.bot) return;

    return await interaction.reply({
      embeds: [
        {
          type: "rich",
          title: _("role"),
          description: _("role_command"),
          fields: [
            {
              name: _("commands"),
              value:
                "/ga \n /role-get-color `role` \n /role-assign `role` `user` \n /role-drop `role` `user`",
            },
          ],
        },
      ],
    });
  },
};
