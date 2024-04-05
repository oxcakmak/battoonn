const { SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("st")
    .setDescription(_("spotify_command")),
  async execute(interaction) {
    if (interaction.bot) return;

    return await interaction.reply({
      embeds: [
        {
          type: "rich",
          title: _("spotify"),
          description: _("spotify_command"),
          fields: [
            {
              name: _("commands"),
              value: "/stp `query` \n /sts \n /stn \n /stc",
            },
          ],
        },
      ],
    });
  },
};
