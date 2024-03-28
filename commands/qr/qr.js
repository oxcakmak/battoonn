const { SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder().setName("qr").setDescription(_("qr_code")),
  async execute(interaction) {
    if (interaction.bot) return;

    return await interaction.reply({
      embeds: [
        {
          type: "rich",
          title: _("qr_code"),
          description: _("generates_qr_code"),
          fields: [
            {
              name: _("commands"),
              value: "/qr-generate `battoonn bot`",
            },
          ],
        },
      ],
    });
  },
};
