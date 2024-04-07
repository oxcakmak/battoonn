const { SlashCommandBuilder } = require("discord.js");
const { SongQueues } = require("../../database/schemas");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mc")
    .setDescription(_("play_music_via_spotify")),
  async execute(interaction) {
    if (interaction.bot) return;

    const queueQuery = await SongQueues.findOne({
      server: interaction.guild.id,
    });

    if (!queueQuery)
      return await interaction.reply({
        content: _("no_queues_to_clean"),
      });

    const deleteSongQueues = await SongQueues.deleteMany({
      server: interaction.guild.id,
    });

    if (!deleteSongQueues)
      return await interaction.reply({
        content: _("music_queue_not_cleared"),
      });

    return await interaction.reply({
      content: _("music_queue_cleared"),
    });
  },
};
