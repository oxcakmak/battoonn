const { SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");
const { Configs, ForumTransactions } = require("../../database/schemas");
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

    const lock = interaction.options.getString("lock") === "yes" ? true : false;

    const forums = await Configs.findOne({
      server: interaction.guild.id,
    });

    if (!forums)
      return await interaction.reply({
        content: _("register_to_use_forum_commands"),
        ephemeral: true,
      });

    const transactions = await ForumTransactions.findOne({
      server: interaction.guild.id,
      threadId: interaction.channel.id,
      moderationById: interaction.member.id,
    });

    if (transactions) {
      transactions.moderationType = "solve";
    } else {
      const newTransactions = await new ForumTransactions({
        server: interaction.guild.id,
        threadId: interaction.channel.id,
        moderationById: interaction.member.id,
        moderationType: "solve",
      });
      await newTransactions.save();
    }

    /*

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

    await channel.setLocked(lock);

    try {
      const solveThread =
        channel.isThread() &&
        !channel.name.startsWith(solvedText) &&
        (await channel.setName(
          solvedText + channel.name.replace(solvedText, "")
        ));

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
    await channel.setArchived(true);
    */
  },
};
