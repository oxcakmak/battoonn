const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const { Configs } = require("../../database/schemas");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("config-allow-channel")
    .setDescription(_("command_channel"))
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription(_("commands_run_channel"))

        .setRequired(true)
    ),
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

    const serverId = await interaction.guild.id;

    const channel = interaction.options.getChannel("channel");

    const configsQuery = await Configs.findOne({ server: serverId });

    if (!configsQuery)
      return await interaction.reply({
        content: _("register_the_server_first"),
      });

    if (!channel) configsQuery.allowedChannels = null;

    if (!configsQuery.allowedChannels.includes(channel.id))
      configsQuery.allowedChannels.push(channel.id);

    const configsUpdate = await configsQuery.save();
    if (!configsUpdate)
      return await interaction.reply({
        content: _("server_settings_update_failed"),
        ephemeral: true,
      });

    return await interaction.reply({
      content: _("server_settings_update_success"),
    });
  },
};
