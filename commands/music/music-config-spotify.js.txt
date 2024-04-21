const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");
const { MusicConfigs } = require("../../database/schemas");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("music-config-spotify")
    .setDescription(_("forum_configuration_role_and_resolved_title"))
    .addStringOption((option) =>
      option
        .setName("client")
        .setDescription(_("api_client_id"))
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("secret")
        .setDescription(_("api_client_secret"))
        .setRequired(true)
    ),
  async execute(interaction) {
    if (interaction.bot) return;

    // Check if the user has permission to ban members
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await interaction.reply({
        content: _("you_do_not_have_permission_command"),
        ephemeral: true,
      });

    try {
      const clientId = await interaction.options.getString("client");
      const clientSecret = await interaction.options.getString("secret");

      const spotifyQuery = await MusicConfigs.findOne({
        server: interaction.guild.id,
      });

      spotifyQuery.spotifyClientId = clientId ? clientId : null;
      spotifyQuery.spotifyClientSecret = clientSecret ? clientSecret : null;

      const updatedSpotify = await spotifyQuery.save();

      if (!updatedSpotify)
        return await interaction.reply({
          content: _("forum_not_updated"),
          ephemeral: true,
        });

      return await interaction.reply({
        content: _("forum_updated"),
      });
    } catch (error) {
      return await interaction.reply({
        content: _("an_unknown_error_occurred"),
      });
    }
  },
};
