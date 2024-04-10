const { SlashCommandBuilder } = require("discord.js");
const { SongQueues } = require("../../database/schemas");
const { _ } = require("../../utils/localization");
const { getNextTrack } = require("../../vendor/queue");
const play = require("play-dl");
const urlParser = require("js-video-url-parser");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription(_("command"))
    .addStringOption((option) =>
      option.setName("query").setDescription(_("search_word_or_link"))
    ),
  async execute(interaction) {
    if (interaction.bot) return;

    const query = interaction.options.getString("query");

    const parsedUrl = urlParser.parse(query).id;
    const url = await urlParser.create({
      videoInfo: parsedUrl,
      format: "short",
    });

    const data = {
      server: interaction.guild.id,
      interaction: interaction,
      message: interaction.message,
      currentChannel: interaction.channel,
    };

    const nextTrack = await getNextTrack(interaction.guild.id);

    let song;
    if (!nextTrack.new) {
      song = nextTrack.old;
      console.log("yeni yok");
    } else {
      song = nextTrack.new;
      console.log("yeni var");
    }

    const sendData = {
      ...data,
      ...song,
    };

    return await interaction.reply({
      content: "Şu anda müzik çalmıyor!",
    });
  },
};
