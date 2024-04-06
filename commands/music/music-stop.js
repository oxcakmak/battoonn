const { SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");
const { queue } = require("../../vendor/queue");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ms")
    .setDescription(_("play_music_via_spotify")),
  async execute(interaction) {
    if (interaction.bot) return;

    if (!interaction.guild.voiceStates.cache.get(interaction.client.user.id)) {
      return await interaction.reply({ content: "Şu anda müzik çalmıyor!" });
    }

    let connection = await interaction.guild.voiceStates.cache.get(
      interaction.client.user.id
    );
    await connection.destroy();
    await queue.destroy();

    await interaction.reply({ content: "Müzik durduruldu." });
  },
};
