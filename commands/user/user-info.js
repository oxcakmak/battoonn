const { SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("user-info")
    .setDescription(_("shows_user_information"))
    .addUserOption((option) =>
      option.setName("user").setDescription(_("user")).setRequired(true)
    ),
  async execute(interaction) {
    if (interaction.bot) return;

    const target = interaction.options.get("user");

    // Fetch the corresponding member from the guild
    const member = await interaction.guild.members.fetch(target);

    const { bot, globalName, tag, username } = member.user;

    try {
      /* { name: `id`, value: member.user.id, }, */
      // Display user information
      return await interaction.reply({
        embeds: [
          {
            type: "rich",
            fields: [
              {
                name: _("username"),
                value: username,
              },
              {
                name: !bot ? _("global_name") : _("discriminator"),
                value: !bot ? globalName : tag,
              },
            ],
            image: {
              url: member.user.displayAvatarURL({ format: "jpg", size: 512 }),
              height: 250,
              width: 250,
            },
            author: {
              name: _("user_information_variable", { variable: username }),
            },
          },
        ],
      });
    } catch (error) {
      console.log(error.rawError.message);
      return await interaction.reply({
        content: _("user_not_found"),
        ephemeral: true,
      });
    }
  },
};
