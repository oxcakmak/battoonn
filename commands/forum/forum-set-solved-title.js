const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");
const { Forums } = require("../../database/schemas");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("forum-set-solved-title")
    .setDescription(_("forum_configuration_role_and_resolved_title"))
    .addStringOption((option) =>
      option
        .setName("title")
        .setDescription(_("thread_untied_text"))
        .setRequired(true)
    ),

  async execute(interaction) {
    if (interaction.bot) return;

    // Check if the user has permission to ban members
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await interaction.reply({
        content: _("you_do_not_have_permission_command"),
        ephemeral: true,
      });

    try {
      const title =
        (await interaction.options.getString("title")) || _("solved_uppercase");

      const forumsQuery = await Forums.findOne({
        server: interaction.guild.id,
      });

      if (!forumsQuery) {
        const newForums = new Forums({
          server: interaction.guild.id,
          solvedText: title,
          allowedRole: null,
        });

        const savedForums = await newForums.save();

        if (!savedForums)
          return await interaction.reply({
            content: _("forum_not_registered"),
            ephemeral: true,
          });

        return await interaction.reply({
          content: _("forum_registered"),
          ephemeral: true,
        });
      }

      if (title) forumsQuery.solvedText = title;

      const updatedForums = await forumsQuery.save();

      if (!updatedForums)
        return await interaction.reply({
          content: _("forum_not_updated"),
          ephemeral: true,
        });

      return await interaction.reply({
        content: _("forum_updated"),
        ephemeral: true,
      });
    } catch (error) {
      return await interaction.reply({
        content: _("an_unknown_error_occurred"),
      });
    }
  },
};
