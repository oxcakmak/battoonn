const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const { Configs, CustomCommands } = require("../../database/schemas");
const { _ } = require("../../utils/localization");
const {
  startsWithPrefix,
  splitCommandString,
} = require("../../utils/stringFunctions");
const { clearEmptyArray } = require("../../utils/arrayFunctions");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("custom-commands-edit")
    .setDescription("Custom Commands Edit")
    .addStringOption((option) =>
      option
        .setName("command")
        .setDescription(
          "The command you want to edit. Example: prefix+name => !youtube"
        )
        .setRequired(true)
    )

    .addStringOption((option) =>
      option
        .setName("response")
        .setDescription(
          "Custom command response. Example: My Youtube channel: ..."
        )
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

    const command = interaction.options.getString("command");
    const response = interaction.options.getString("response");

    const splittedPrefixString = clearEmptyArray(splitCommandString(command));

    if (!startsWithPrefix(command))
      return await interaction.reply({
        content: "No prefix in command",
        ephemeral: true,
      });

    const customCommandsQuery = await CustomCommands.findOne({
      server: serverId,
      prefix: splittedPrefixString[0],
      name: splittedPrefixString[1],
    });

    if (!customCommandsQuery)
      return await interaction.reply({
        content: "This command not exists_" + splittedPrefixString[0],
        ephemeral: true,
      });

    customCommandsQuery.response = response;

    const customCommandUpdate = await customCommandsQuery.save();

    if (!customCommandUpdate)
      return await interaction.reply({
        content: "Custom command not updated",
        ephemeral: true,
      });

    return await interaction.reply({
      content: "Custom command updated",
      ephemeral: true,
    });
  },
};
