const { SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");
const { containsMultipleData } = require("../../utils/arrayFunctions");
const { Configs } = require("../../database/schemas");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("forum-unlock")
    .setDescription(_("unlock_thread"))
    .addStringOption((option) =>
      option
        .setName("title")
        .setDescription(_("if_resolved_title_exists_should_it_remove"))
        .addChoices(
          { name: _("option_yes"), value: "yes" },
          { name: _("option_no"), value: "no" }
        )
    ),
  async execute(interaction) {
    if (interaction.bot) return;

    const replaceTitle = interaction.options.getString("title") || "no";

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

    try {
      const channel = await interaction.guild.channels.fetch(
        interaction.channel.id
      );

      if (
        replaceTitle === "yes" &&
        channel.name.includes(forums.forumSolvedText)
      )
        channel.isThread() &&
          (await channel.setName(
            channel.name.replace(forums.forumSolvedText + " - ", "")
          ));

      const unlockThread =
        channel.isThread() && (await channel.setLocked(false));

      if (!unlockThread)
        return await interaction.reply({
          content: _("thread_could_not_be_unlocked"),
          ephemeral: true,
        });

      return await interaction.reply({
        content: _("thread_unlocked"),
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
