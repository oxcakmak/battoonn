const { SlashCommandBuilder, TextChannel } = require("discord.js");
const { _ } = require("../../utils/localization");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("backup-create")
    .setDescription(_("role_command")),
  async execute(interaction) {
    if (interaction.bot) return;
  },
};
