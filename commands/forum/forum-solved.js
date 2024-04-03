const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");
const { Forums } = require("../../database/schemas");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("forum-solved")
    .setDescription(_("mark_thread_as_resolved")),
  async execute(interaction) {
    if (interaction.bot) return;

    try {
      const forums = await Forums.findOne({
        server: interaction.guild.id,
      });

      const user = await interaction.guild.members.cache.get(
        interaction.user.id
      );

      if (!user.permissions.has(forums.allowedRole))
        return await interaction.reply({
          content: _("you_do_not_have_permission_command"),
          ephemeral: true,
        });

      const channel = await interaction.guild.channels.fetch(
        interaction.channel.id
      );

      const solvedText = forums ? forums.solvedText : _("solved_uppercase");

      const solveThread = await channel.setName(
        solvedText + " - " + channel.name.replace(forums.solvedText, "")
      );

      if (!solveThread)
        return await interaction.reply({
          content: _("thread_not_changed_to_resolved"),
          ephemeral: true,
        });

      return await interaction.reply({
        content: _("thread_changed_to_resolved"),
        ephemeral: true,
      });
    } catch (error) {
      console.log(error);
      return await interaction.reply({
        content: _("an_unknown_error_occurred"),
        ephemeral: true,
      });
    }
  },
};
