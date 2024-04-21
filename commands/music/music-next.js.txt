const { SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mn")
    .setDescription(_("play_music_via_spotify")),
  async execute(interaction) {
    if (interaction.bot) return;

    if (!interaction.guild.voiceStates.cache.get(interaction.client.user.id)) {
      return await interaction.reply({ content: "Şu anda müzik çalmıyor!" });
    }

    await interaction.reply({ content: "Bir sonraki şarkıya geçiliyor..." });
  },
};
