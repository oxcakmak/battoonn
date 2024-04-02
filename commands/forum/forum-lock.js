const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("forum-lock")
    .setDescription(_("lock_the_thread")),
  async execute(interaction) {
    if (interaction.bot) return;

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.ManageThreads
      )
    )
      return await interaction.reply({
        content: _("you_do_not_have_permission_command"),
        ephemeral: true,
      });

    try {
      const channel = await interaction.guild.channels.fetch(
        interaction.channel.id
      );

      const lockThread = await channel.setLocked(true);

      if (!lockThread)
        return await interaction.reply({
          content: _("thread_could_not_be_locked"),
          ephemeral: true,
        });

      return await interaction.reply({
        content: _("thread_locked"),
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
