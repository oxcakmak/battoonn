const { SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("giveaway")
    .setDescription(_("role_command"))
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription(
          "Section where you can give information about the giveaway"
        )
    ),
  async execute(interaction) {
    if (interaction.bot) return;

    if (interaction.options.data.length === 0)
      return await interaction.reply({
        embeds: [
          {
            type: "rich",
            title: _("role"),
            description: _("role_command"),
            fields: [
              {
                name: _("commands"),
                value:
                  "/ga \n /role-get-color `role` \n /role-assign `role` `user` \n /role-drop `role` `user`",
              },
            ],
          },
        ],
      });

    if (interaction.options.data.length > 0) {
      if (
        !interaction.member.permissions.has(
          PermissionsBitField.Flags.Administrator
        )
      )
        return await interaction.reply({
          content: _("you_do_not_have_permission_command"),
          ephemeral: true,
        });

      const code = interaction.options.getString("code");

      const giveaway = await Giveaways.findOne({
        server: serverId,
        code: code,
      });

      if (!giveaway)
        return await interaction.reply({
          content: "Giveaway not found",
          ephemeral: true,
        });
      /*
      
      return await interaction.reply({
        embeds: [
          {
            type: "rich",
            title: _("role"),
            description: _("role_command"),
            fields: [
              {
                name: _("commands"),
                value:
                  "/ga \n /role-get-color `role` \n /role-assign `role` `user` \n /role-drop `role` `user`",
              },
            ],
          },
        ],
      });
      */
    }
  },
};
