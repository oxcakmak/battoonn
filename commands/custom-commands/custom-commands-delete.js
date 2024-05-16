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
    .setName("custom-commands-delete")
    .setDescription("Custom Commands Delete")
    .addStringOption((option) =>
      option
        .setName("command")
        .setDescription(
          "The command you want to delete. Example: prefix+name => !youtube"
        )
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

    const command = interaction.options.getString("command");

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
        content: "This command not exists",
        ephemeral: true,
      });

    const customCommandDelete = await CustomCommands.deleteOne({
      server: serverId,
      prefix: splittedPrefixString[0],
      name: splittedPrefixString[1],
    });

    if (!customCommandDelete)
      return await interaction.reply({
        content: "Custom command not deleted",
        ephemeral: true,
      });

    return await interaction.reply({
      content: "Custom command deleted",
      ephemeral: true,
    });
  },
};
