const { SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");
const { containsMultipleData } = require("../../utils/arrayFunctions");
const { Forums } = require("../../database/schemas");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("forum-unlock")
    .setDescription(_("unlock_thread")),
  async execute(interaction) {
    if (interaction.bot) return;

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

    try {
      const channel = await interaction.guild.channels.fetch(
        interaction.channel.id
      );

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
