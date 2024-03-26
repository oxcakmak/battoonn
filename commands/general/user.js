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

    // Command description
    if (interaction.options.data.length === 0)
      return await interaction.reply({
        embeds: [
          {
            type: "rich",
            title: _("user_command"),
            description: _("shows_user_information"),
            color: 0xffffff,
            fields: [
              {
                name: _("use_of"),
                value: `/user {user}`,
              },
              {
                name: _("example"),
                value: `/user battoonn`,
              },
            ],
          },
        ],
      });

    let target = interaction.options.get("user");

    // If no user is mentioned, default to the message sender
    if (!target) target = interaction.user;

    // Fetch the corresponding member from the guild
    const member = await interaction.guild.members.fetch(target);

    /* { name: `id`, value: member.user.id, }, */
    // Display user information
    return await interaction.reply({
      embeds: [
        {
          type: "rich",
          title: "",
          description: "",
          color: 0xffffff,
          fields: [
            {
              name: _("username"),
              value: member.user.username,
            },
            {
              name: _("global_name"),
              value: member.user.globalName,
            },
          ],
          image: {
            url: member.user.displayAvatarURL(),
            height: 250,
            width: 250,
          },
          author: {
            name: _("user_information_variable", { variable: member.user.tag }),
          },
        },
      ],
    });
  },
};
