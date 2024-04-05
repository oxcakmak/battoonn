const { SlashCommandBuilder } = require("discord.js");
const { MusicConfigs } = require("../../database/schemas");
const { _ } = require("../../utils/localization");
const Spotify = require("spotify-finder");
const { parse } = require("track-duration");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stp")
    .setDescription(_("role_command"))
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription(_("search_word_or_link"))
        .setRequired(true)
    ),
  async execute(interaction) {
    if (interaction.bot) return;

    const query = interaction.options.getString("query");

    const MusicConfigsQuery = await MusicConfigs.findOne({
      server: interaction.guild.id,
    });

    if (!MusicConfigs)
      return await interaction.reply({
        content: _("register_the_server_first"),
      });

    const spotifyClient = await new Spotify({
      consumer: {
        key: MusicConfigsQuery.spotifyClientId, // from v2.1.0 is required
        secret: MusicConfigsQuery.spotifyClientSecret, // from v2.1.0 is required
      },
    });

    const spotifySearch = await spotifyClient.search({
      q: query,
      type: "track",
      limit: 10,
    });

    const tracks = spotifySearch ? spotifySearch.tracks.items : null;

    if (!tracks)
      return await interaction.reply({
        content: _("no_results_found"),
      });

    let nameList;
    let nameListJson;
    let number = 0;
    await tracks.forEach(async (track) => {
      const artists = track.album.artists;
      const artistNames = artists.map((artist) => artist.name).join(" & ");
      const duration = track.duration_ms;
      const humanizeDuration = await parse(duration);
      const name = track.name;
      const href = track.href;
      const fullname = artistNames + " - " + name;
      const fullTitle = fullname + `[${humanizeDuration}]`;
      nameListJson.push({ label: fullTitle, value: number++, emoji: "" });
    });
    /*
    await interaction.reply({
      embeds: [
        {
          type: "rich",
          title: `Arama sonucu`,
          description: `asdasd`,
          color: 0x6ed7d7,
          fields: [
            {
              name: "\u200B",
              value: `asdasdsadsaddddasdddasd`,
            },
          ],
        },
      ],
      components: [
        {
          type: 1,
          components: [
            {
              custom_id: `musicList`,
              placeholder: `sadasddddd`,
              options: [
                {
                  label: `Choose Music`,
                  value: `choose`,
                  default: true,
                },
                JSON.stringify(nameListJson),
              ],
              min_values: 1,
              max_values: 1,
              type: 3,
            },
          ],
        },
      ],
    });
    console.log(nameListJson);
    */
  },
};
