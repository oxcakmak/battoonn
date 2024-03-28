const { SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("user-avatar")
    .setDescription(_("show_users_avatar"))
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription(_("show_users_avatar"))
        .setRequired(true)
    ),
  async execute(interaction) {
    if (interaction.bot) return;

    const target = interaction.options.get("user");
    const member = await interaction.guild.members.fetch(target);

    const embed = {
      type: "rich",
      title: "",
      description: "",
      title: _("user_avatar_variable", {
        variable: member.user.username,
      }),
      image: {
        url: member.user.displayAvatarURL(),
        height: 0,
        width: 0,
      },
    };

    await interaction.reply({ embeds: [embed] });
  },
};
