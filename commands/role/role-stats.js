const { SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("role-stats")
    .setDescription(_("fields")),
  async execute(interaction) {
    if (interaction.bot) return;

    return await interaction.reply({
      content: _("fields"),
    });
  },
};
