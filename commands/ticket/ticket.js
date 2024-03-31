const { SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription(_("ticket_description_full")),
  async execute(interaction) {
    if (interaction.bot) return;

    return await interaction.reply({
      embeds: [
        {
          type: "rich",
          title: _("ticket_command"),
          description: _("ticket_description_full"),
          fields: [
            {
              name: _("commands"),
              value:
                "/ticket-module-enable \n /ticket-module-disable \n /ticket-create-template \n /ticket-config {category|channel|title|description|button|role}",
            },
            {
              name: _("fields") + " (for ticket-config)",
              value: `**category**: ${_(
                "ticket_category_open_text"
              )} \n **channel**: ${_(
                "ticket_template_channel"
              )} \n **title**: ${_(
                "ticket_template_title"
              )} \n **description**: ${_(
                "ticket_template_description"
              )} \n **button**: ${_(
                "ticket_template_button_text_example"
              )} \n **role**: ${_("ticket_role_description")}`,
            },
          ],
        },
      ],
    });
  },
};
