const { SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");

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
      !authenticator.verifyCode(
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
    });
    */
  },
};
