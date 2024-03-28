const { SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");
const randomHex = require("random-hex");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("random-hex")
    .setDescription(_("generate_random_color_code")),
  async execute(interaction) {
    if (interaction.bot) return;

    return await interaction.reply({
      embeds: [
        {
          type: "rich",
          title: _("color_code"),
          description:
            "`" + (await randomHex.generate().toLocaleUpperCase()) + "`",
        },
      ],
    });
  },
};
