const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const { Configs, LoggerConfigs } = require("../../database/schemas");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("logger-disable")
    .setDescription("Turns off logging"),
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

    const checkRegisteredServer = await Configs.findOne({ server: serverId });
    const LoggerConfigsQuery = await LoggerConfigs.findOne({
      server: serverId,
    });

    if (!checkRegisteredServer)
      return await interaction.reply({
        content: _("register_the_server_first"),
      });

    LoggerConfigsQuery.moduleEnabled = false;

    const LoggerConfigsUpdate = await LoggerConfigsQuery.save();
    if (!LoggerConfigsUpdate)
      return await interaction.reply({
        content: _("an_unknown_error_occurred"),
        ephemeral: true,
      });

    return await interaction.reply({
      content: "Log module disabled",
    });
  },
};
