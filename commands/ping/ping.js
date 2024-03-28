const { SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription(_("reply_with_pong")),
  async execute(interaction) {
    if (interaction.bot) return;
    await interaction.reply("Pong!");
  },
};
