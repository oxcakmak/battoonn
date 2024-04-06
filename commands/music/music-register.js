const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const { MusicConfigs } = require("../../database/schemas");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("music-register")
    .setDescription(_("register_server")),
  async execute(interaction) {
    if (interaction.bot) return;

    // Check if the user has permission to manage messages
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await interaction.reply({
        content: _("you_do_not_have_permission_command"),
        ephemeral: true,
      });

    const serverId = interaction.guild.id;
    const server = await MusicConfigs.findOne({ server: serverId });

    if (server)
      return await interaction.reply({
        content: _("server_already_saved"),
        ephemeral: true,
      });

    const newConfig = new MusicConfigs({
      server: serverId,
    });

    const savedConfig = await newConfig.save();

    if (!savedConfig)
      return await interaction.reply({
        content: _("server_register_failed"),
        ephemeral: true,
      });

    return await interaction.reply({
      content: _("server_register_success"),
    });
  },
};