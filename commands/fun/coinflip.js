const { SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("coinflip")
    .setDescription(_("flip_a_coin")),
  async execute(interaction) {
    const coinFlip = Math.random() < 0.5 ? "heads" : "tails";
    await interaction.reply(_("flipcoin_landed_text", { side: coinFlip }));
  },
};
