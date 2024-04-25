const { SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");
const isDiscordInvite = require("is-discord-invite");

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
      ephemeral: true,
    });
  },
};
