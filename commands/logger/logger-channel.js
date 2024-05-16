const {
  PermissionsBitField,
  SlashCommandBuilder,
  ChannelType,
} = require("discord.js");
const { Configs, LoggerConfigs } = require("../../database/schemas");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("logger-channel")
    .setDescription("Text channel to send log records to")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Text channel to send log records to")
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

    const LoggerConfigsQuery = await LoggerConfigs.findOne({
      server: serverId,
    });

    if (!LoggerConfigsQuery)
      return await interaction.reply({
        content: _("register_the_server_first"),
        ephemeral: true,
      });

    LoggerConfigsQuery.channel = channel.id;

    const LoggerConfigsUpdate = await LoggerConfigsQuery.save();
    if (!LoggerConfigsUpdate)
      return await interaction.reply({
        content: "Log channel not updated",
        ephemeral: true,
      });

    return await interaction.reply({
      content: "Log channel updated",
      ephemeral: true,
    });
  },
};
