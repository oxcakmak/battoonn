const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("speed")
    .setDescription(_("speed_test")),
  async execute(interaction, client) {
    if (interaction.bot) return;
    const embed = new EmbedBuilder().setDescription(`${client.ws.ping} ms`);
    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
