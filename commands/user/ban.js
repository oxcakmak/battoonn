const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription(_("bans_a_user"))
    .addUserOption((option) =>
      option.setName("user").setDescription(_("filter_by_user"))
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription(_("reason_for_ban"))
    ),
  async execute(interaction) {
    if (interaction.bot) return;

    // Command description
    if (interaction.options.data.length === 0)
      return await interaction.reply({
        embeds: [
          {
            type: "rich",
            title: _("ban_command"),
            description: _("bans_a_user"),
            color: 0xffffff,
            fields: [
              {
                name: _("use_of"),
                value: `/ban {user} {reason}`,
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
    const reason =
      interaction.options.getString("reason") || _("no_reason_provided");

    try {
      await interaction.guild.members.ban(user, { reason });
      await interaction.reply({
        content: _("user_banned"),
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: _("user_not_banned"),
        ephemeral: true,
      });
    }
  },
};
