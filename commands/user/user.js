const { SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription(_("shows_user_information")),
  async execute(interaction) {
    if (interaction.bot) return;

    return await interaction.reply({
      embeds: [
        {
          type: "rich",
          title: _("user_command"),
          description: _("user_command"),
          fields: [
            {
              name: _("commands"),
              value:
                "/user-avatar `battoonn` - " +
                " \n /user-info `battoonn` " +
                " \n /user-ban `battoonn` `troll and spam`" +
                " \n /user-unban `12345678901112131415`",
            },
          ],
        },
      ],
    });
  },
};
