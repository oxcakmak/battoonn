const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");
const { _ } = require("../../utils/localization");

const { botColor } = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("speed")
    .setDescription(_("speed_test")),
  async execute(interaction, client) {
    if (interaction.bot) return;
    const embed = new EmbedBuilder()
      .setColor(botColor)
      .setDescription(`${client.ws.ping}ms`);
    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
