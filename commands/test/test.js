const { SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");
const GoogleAuthenticator = require("js-google-authenticator");

const authenticator = new GoogleAuthenticator();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription(_("command"))
    .addStringOption((option) =>
      option.setName("query").setDescription(_("search_word_or_link"))
    ),
  async execute(interaction) {
    if (interaction.bot) return;
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

    
    return await interaction.reply({
      content: authenticator.encode(interaction.guild.id),
      ephemeral: true,
    });

   return await interaction.reply({
      content: authenticator.verifyCode(
        secret,
        interaction.options.getString("query")
      ),
      ephemeral: true,
    });

    return await interaction.reply({
      content: authenticator.verifyCode(
        secret,
        interaction.options.getString("query")
      ),
      ephemeral: true,
    });
    

    if (
      authenticator.verifyCode(
        "GEZDCNRQHE4DSMZRGA3TKOBUGYYTONA",
        interaction.options.getString("query")
      )
    )
      return await interaction.reply({
        content: "Not Valid Key",
        ephemeral: true,
      });

    return await interaction.reply({
      content: "Valid Key",
      ephemeral: true,
    });*/
  },
};
