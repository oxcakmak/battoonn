const { SlashCommandBuilder } = require("discord.js");
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
      const search = await play.search(query, {
        limit: 10,
      });

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
        trackList.push(`${numbers}. [${name}](${url})`);
        nameList.push({
          style: 2,
          label: numbers,
          id: numbers,
          disabled: false,
          type: 2,
        });
        numbers++;
      });

      const options = nameList.map((option) => ({
        style: option.style,
        label: option.label,
        custom_id: `btnMusicLine${option.id}`,
        disabled: option.disabled,
        type: option.type,
      }));

      function splitArrayIntoComponents(array, buttonsPerRow = 5) {
        const components = [];
        let currentRow = [];

        for (const item of array) {
          currentRow.push(item); // Add item to the current row

          if (currentRow.length === buttonsPerRow) {
            components.push({ type: 1, components: currentRow }); // Add full row to components
            currentRow = []; // Reset current row for the next chunk
          }
        }

        // Add the last remaining items (if any):
        if (currentRow.length > 0) {
          components.push({ type: 1, components: currentRow });
        }

        return components;
      }

      // Example usage:
      const components = splitArrayIntoComponents(options);

      await interaction
        .reply({
          embeds: [
            {
              type: "rich",
              title: _("search_resuts_for_query_variable", {
                query: `"${query}"`,
              }),
              description: trackList.join("\n"),
            },
          ],
          components: components,
          ephemeral: true,
        })
        .then((a) => {
          // Schedule the deletion after 10 seconds
          setTimeout(async () => {
            await interaction.deleteReply();
          }, 15000);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }

    /*
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
          */
  },
};
