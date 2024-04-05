const { SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");
const { containsMultipleData } = require("../../utils/arrayFunctions");
const { Configs } = require("../../database/schemas");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("forum-lock")
    .setDescription(_("lock_the_thread"))
    .addStringOption((option) =>
      option.setName("reason").setDescription(_("why_are_you_closing_ticket"))
    ),
  async execute(interaction) {
    if (interaction.bot) return;

    const reason =
      interaction.options.getString("reason") || _("no_reason_provided");

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

      if (channel.locked)
        return await interaction.reply({
          content: _("thread_already_locked"),
          ephemeral: true,
        });

      const lockThread = channel.isThread() && (await channel.setLocked(true));

      if (!lockThread)
        return await interaction.reply({
          content: _("thread_could_not_be_locked"),
          ephemeral: true,
        });

      return await interaction.reply({
        content: reason
          ? _("reason_with_variable", { reason: reason })
          : _("thread_locked"),
        ephemeral: reason ? false : true,
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
