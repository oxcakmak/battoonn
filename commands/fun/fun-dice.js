const { SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("fun-dice")
    .setDescription(_("flip_a_coin")),
  async execute(interaction) {
    const roll = Math.floor(Math.random() * 6) + 1;
    await interaction.reply(_("rolled_with_roll_variable", { roll: roll }));
  },
};
