const {
  PermissionsBitField,
  SlashCommandBuilder,
  ChannelType,
} = require("discord.js");
const { Configs } = require("../../database/schemas");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("config-response-channel")
    .setDescription(_("response_channel"))
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription(_("response_channel"))
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    ),
  async execute(interaction) {
    if (interaction.bot) return;

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

    configsQuery.responseChannel = channel ? channel.id : null;

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
