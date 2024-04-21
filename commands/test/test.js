const { SlashCommandBuilder } = require("discord.js");
const { SongQueues } = require("../../database/schemas");
const { _ } = require("../../utils/localization");
const { getNextTrack } = require("../../vendor/queue");
const play = require("play-dl");
const urlParser = require("js-video-url-parser");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription(_("command"))
    .addStringOption((option) =>
      option.setName("query").setDescription(_("search_word_or_link"))
    ),
  async execute(interaction) {
    if (interaction.bot) return;

    return await interaction.reply({
      content: "Şu anda müzik çalmıyor!",
    });
  },
};
