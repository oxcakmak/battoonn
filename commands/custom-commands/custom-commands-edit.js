const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const { Configs, CustomCommands } = require("../../database/schemas");
const { _ } = require("../../utils/localization");
const { validateCommandPrefix } = require("../../utils/stringFunctions");

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
        .setName("name")
        .setDescription("Custom command title. Example: youtube")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("response")
        .setDescription(
          "Custom command response. Example: My Youtube channel: ..."
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("prefix")
        .setDescription(
          "The prefix you want to use. Default: ! (exclamation symbol)."
        )
        .setMaxLength(1)
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

    const name = interaction.options.getChannel("name");
    const response = interaction.options.getString("response");
    const prefix = interaction.options.getString("prefix");

    const customCommandsQuery = await CustomCommands.findOne({
      server: serverId,
      prefix: prefix,
      name: name,
    });

    if (!validateCommandPrefix(prefix))
      return await interaction.reply({
        content:
          "The command prefix can only be !, _, -, + or . (exclamation, underscore, hypen, plus, and dot) it could be.",
        ephemeral: true,
      });

    if (!customCommandsQuery)
      return await interaction.reply({
        content: "This command already exists",
        ephemeral: true,
      });

    customCommandsQuery.name = name;
    customCommandsQuery.response = response;
    if (prefix) customCommandsQuery.prefix = prefix;

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
