const { SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("r")
    .setDescription(_("generate_random_items")),
  async execute(interaction) {
    if (interaction.bot) return;

    return await interaction.reply({
      embeds: [
        {
          type: "rich",
          title: _("random_command"),
          description: _("generate_random_items"),
          fields: [
            {
              name: _("commands"),
              value: `/random-hex - ${_("generate_random_color_code")}`,
            },
          ],
        },
      ],
    });
  },
};
