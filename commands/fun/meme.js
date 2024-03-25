const { SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("meme")
    .setDescription(_("random_show_meme")),
  async execute(interaction) {
    const memeUrl = `https://www.reddit.com/r/memes/.json?limit=100`;

    try {
      const response = await fetch(memeUrl);
      const data = await response.json();
      const posts = data.data.children;

      const randomIndex = Math.floor(Math.random() * posts.length);
      const memePost = posts[randomIndex].data;

      if (!memePost.url.endsWith(".jpg") && !memePost.url.endsWith(".png"))
        return await interaction.reply({
          content: _("no_memes_found_this_subreddit"),
          ephemeral: true,
        });

      await interaction.reply({
        embeds: [{ image: memePost.url }],
      });
    } catch (error) {
      console.error("Error fetching meme:", error);
      await interaction.reply({
        content: _("failed_retrieve_meme"),
        ephemeral: true,
      });
    }
  },
};
