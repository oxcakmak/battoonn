const { SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");
const { queue } = require("../../vendor/queue");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mc")
    .setDescription(_("play_music_via_spotify")),
  async execute(interaction) {
    if (interaction.bot) return;

    return await interaction.reply({ content: "Temizlendi." });
  },
};
