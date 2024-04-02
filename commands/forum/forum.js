const { SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("forum")
    .setDescription(_("forum_management")),
  async execute(interaction) {
    if (interaction.bot) return;

    return await interaction.reply({
      embeds: [
        {
          type: "rich",
          title: _("forum"),
          description: _("forum_command"),
          fields: [
            {
              name: _("commands"),
              value:
                "/user-avatar `battoonn` - " +
                _("shows_user_avatar") +
                " \n /user-info `battoonn` " +
                _("shows_user_information") +
                " \n /user-ban `battoonn` `troll and spam`" +
                _("bans_a_user") +
                " \n /user-unban `12345678901112131415`" +
                _("unban_a_user"),
            },
          ],
        },
      ],
    });
  },
};
