const { SongQueues } = require("../../database/schemas");
const { SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ms")
    .setDescription(_("play_music_via_spotify")),
  async execute(interaction) {
    if (interaction.bot) return;

    if (!interaction.guild.voiceStates.cache.get(interaction.client.user.id))
      return await interaction.reply({ content: "Şu anda müzik çalmıyor!" });

    const queueQuery = await SongQueues.findOne({
      server: interaction.guild.id,
    });

    if (!queueQuery)
      return await interaction.update({
        content: _("you_have_an_music_in_queue"),
      });
  },
};
