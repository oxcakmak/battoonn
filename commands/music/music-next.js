const { SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");
const { queue } = require("../../vendor/queue");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mn")
    .setDescription(_("play_music_via_spotify")),
  async execute(interaction) {
    if (interaction.bot) return;

    if (!interaction.guild.voiceStates.cache.get(interaction.client.user.id)) {
      return await interaction.reply({ content: "Şu anda müzik çalmıyor!" });
    }

    queue.next(); // Skip to the next song in the queue
    await interaction.reply({ content: "Bir sonraki şarkıya geçiliyor..." });
  },
};
