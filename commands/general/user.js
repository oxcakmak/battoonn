const { SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription(_("shows_user_information"))
    .addUserOption((option) =>
      option.setName("user").setDescription(_("user"))
    ),
  async execute(interaction) {
    if (interaction.bot) return;

    let target = interaction.options.get("user");

    // If no user is mentioned, default to the message sender
    if (!target) target = interaction.user;

    // Fetch the corresponding member from the guild
    const member = await interaction.guild.members.fetch(target);

    const embed = {
      type: "rich",
      title: "",
      description: "",
      color: 0x00ffff,
      fields: [
        // { name: `id`, value: member.user.id, },

        {
          name: _("username"),
          value: member.user.username,
        },
        {
          name: _("global_name"),
          value: member.user.globalName,
        },
        {
          name: _("discriminator"),
          value: member.user.discriminator,
        },
        {
          name: _("tag"),
          value: member.user.tag,
        },
        {
          name: _("alternative_tag"),
          value: member.user.username + "#" + member.user.discriminator,
        },
        {
          name: _("avatar"),
          value: " ",
        },
      ],
      image: {
        url: member.user.displayAvatarURL(),
        height: 0,
        width: 0,
      },
      author: {
        name: _("user_information_variable", { variable: member.user.tag }),
      },
    };

    // Display user information
    await interaction.reply({ embeds: [embed] });
  },
};
