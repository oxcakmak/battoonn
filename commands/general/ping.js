const { SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");

module.exports = {
  cooldowns: 5,
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription(_("reply_with_pong")),
  async execute(interaction) {
    await interaction.reply("Pong!");
  },
};
