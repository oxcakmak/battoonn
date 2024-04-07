const { SlashCommandBuilder } = require("discord.js");
const { MusicConfigs } = require("../../database/schemas");
const { _ } = require("../../utils/localization");
const play = require("play-dl");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mp")
    .setDescription(_("play_music_via_spotify"))
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription(_("search_word_or_link"))
        .setRequired(true)
    ),
  async execute(interaction) {
    if (interaction.bot) return;

    const voiceState = interaction.member.voice;
    const currentChannel = interaction.member.voice.channel;

    if (
      !currentChannel ||
      !voiceState ||
      !voiceState.channel ||
      voiceState.channel.id !== currentChannel.id
    )
      return await interaction.reply({
        content: _("you_must_the_audio_channel"),
      });

    const query = interaction.options.getString("query");

    try {
      let search;

      const urlValidate = play.yt_validate(query);

      switch (urlValidate) {
        default:
          search = await play.search(query, {
            limit: 10,
          });
          break;
        case "playlist":
          search = await play.search(query, {
            source: { youtube: "playlist" },
          });
          break;
      }

      let trackList = [];
      let nameList = [];
      let numbers = 1;
      await search.forEach(async (result) => {
        // const id = result.id;
        const url = result.url;
        const title = result.title.slice(0, 50);
        const channelName = result.channel.name;
        const duration = result.durationRaw;
        let name = title + ` | ${channelName}`;
        if (result.type === "video") name += ` | ${duration}`;
        trackList.push(`${numbers}. ${name}`);
        nameList.push({ label: `${numbers}. ${name}`, value: url });
        numbers++;
      });

      const options = nameList.map((option) => ({
        label: option.label,
        value: option.value.toString(),
      }));

      return await interaction.reply({
        embeds: [
          {
            type: "rich",
            title: _("search_resuts_for_query_variable", {
              query: `"${query}"`,
            }),
            description: trackList.join("\n"),
          },
        ],
        components: [
          {
            type: 1,
            components: [
              {
                custom_id: `musicResults`,
                placeholder: _("select_music_want_to_listen"),
                options,
                min_values: 1,
                max_values: 1,
                type: 3,
              },
            ],
          },
        ],
      });
    } catch (error) {
      console.log(error);
    }
  },
};
