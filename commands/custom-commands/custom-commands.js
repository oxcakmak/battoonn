const { SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("custom-commands")
    .setDescription("Custom Commands"),
  async execute(interaction) {
    if (interaction.bot) return;

    return await interaction.reply({
      embeds: [
        {
          type: "rich",
          title: "Custom Commands",
          description: "Custom Commands",
          fields: [
            {
              name: "Custom Commands",
              value:
                "/custom-commands \n /custom-commands add `prefix` `name` `response` \n /custom-commands edit `command` `prefix` `name` `response`",
            },
          ],
        },
      ],
    });
  },
};
