const { SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription(_("show_users_avatar"))
    .addUserOption((option) =>
      option.setName("user").setDescription(_("show_user_information"))
    ),
  async execute(interaction) {
    if (interaction.bot) return;

    let target = interaction.options.get("user");

    if (!target) target = interaction.user;

    const member = await interaction.guild.members.fetch(target);

    const embed = {
      type: "rich",
      title: "",
      description: "",
      color: 0x00ffff,
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
