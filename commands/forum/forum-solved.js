const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("forum-solved")
    .setDescription(_("mark_thread_as_resolved")),
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

      const solveThread = await channel.setName("SOLVED - " + channel.name);

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
