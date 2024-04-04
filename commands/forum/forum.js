const { SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("forum")
    .setDescription(_("forum_configuration_role_and_resolved_title")),
  async execute(interaction) {
    if (interaction.bot) return;

    return await interaction.reply({
      embeds: [
        {
          type: "rich",
          title: _("forum"),
          description: _("forum_command"),
          fields: [
            {
              name: _("example"),
              value:
                "/forum-lock `reason` \n /forum-unlock removeSolvedTitle?`yes|no` \n /forum-solved lock?`yes|no` \n /forum-set-role `role` \n /forum-set-solved-title `title`",
            },
          ],
        },
      ],
    });
  },
};
