const { SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");
const { Forums } = require("../../database/schemas");
const { containsMultipleData } = require("../../utils/arrayFunctions");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("forum-solved")
    .setDescription(_("mark_thread_as_resolved"))
    .addStringOption((option) =>
      option
        .setName("lock")
        .setDescription(_("lock_thread_after_marked_resolved"))
        .addChoices(
          { name: _("lock_it"), value: "yes" },
          { name: _("dont_lock_it"), value: "no" }
        )
    ),
  async execute(interaction) {
    if (interaction.bot) return;

    try {
      const lock =
        interaction.options.getString("lock") === "yes" ? true : false;

      const forums = await Forums.findOne({
        server: interaction.guild.id,
      });

      if (!forums)
        return await interaction.reply({
          content: _("register_to_use_forum_commands"),
          ephemeral: true,
        });

      const roleIds = interaction.member.roles.cache.map((role) => role.id);

      if (!containsMultipleData(roleIds, [forums.allowedRole]))
        return await interaction.reply({
          content: _("you_do_not_have_permission_command"),
          ephemeral: true,
        });

      const channel = await interaction.guild.channels.fetch(
        interaction.channel.id
      );

      const solvedText = forums
        ? forums.solvedText + " - "
        : _("solved_uppercase") + " - ";

      await channel.setLocked(lock);

      const solveThread =
        channel.isThread() &&
        !channel.name.startsWith(solvedText) &&
        (await channel.setName(
          solvedText + channel.name.replace(forums.solvedText, "")
        ));

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
