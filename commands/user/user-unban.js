const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("user-unban")
    .setDescription(_("unban_a_user"))
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription(_("filter_by_user"))
        .setRequired(true)
    ),
  async execute(interaction) {
    if (interaction.bot) return;

    // Command description
    if (interaction.options.data.length === 0)
      return await interaction.reply({
        embeds: [
          {
            type: "rich",
            title: _("usage"),
            description: _("unban_a_user"),
            color: 0xffffff,
            fields: [
              {
                name: _("use_of"),
                value: "/unban `userId`",
              },
            ],
          },
        ],
      });

    // Check if the user has permission to ban members
    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)
    ) {
      return await interaction.reply({
        content: _("you_do_not_have_permission_command"),
        ephemeral: true,
      });
    }

    const user = interaction.options.getUser("user").id;

    try {
      await interaction.guild.members.unban(user);
      await interaction.reply({
        content: _("user_ban_removed"),
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: _("user_ban_not_removed"),
        ephemeral: true,
      });
    }
  },
};
