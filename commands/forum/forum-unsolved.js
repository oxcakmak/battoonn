const { SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");
const { Configs } = require("../../database/schemas");
const { containsMultipleData } = require("../../utils/arrayFunctions");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("forum-unsolved")
    .setDescription(_("mark_thread_as_resolved")),
  async execute(interaction) {
    if (interaction.bot) return;

    const forums = await Configs.findOne({
      server: interaction.guild.id,
    });

    if (!forums)
      return await interaction.reply({
        content: _("register_to_use_forum_commands"),
        ephemeral: true,
      });

    const roleIds = interaction.member.roles.cache.map((role) => role.id);

    if (!containsMultipleData(roleIds, [forums.forumAllowedRole]))
      return await interaction.reply({
        content: _("you_do_not_have_permission_command"),
        ephemeral: true,
      });

    const channel = await interaction.guild.channels.fetch(
      interaction.channel.id
    );

    const solvedText = forums
      ? forums.forumSolvedText + " - "
      : _("solved_uppercase") + " - ";

    if (channel.locked) await channel.setLocked(false);

    try {
      const solveThread =
        channel.isThread() &&
        channel.name.startsWith(solvedText) &&
        (await channel.setName(channel.name.replace(solvedText, "")));

      if (!solveThread)
        return await interaction.reply({
          content: _("thread_not_changed_to_resolved"),
          ephemeral: true,
        });

      await interaction.reply({
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
    await channel.setArchived(false);
  },
};
