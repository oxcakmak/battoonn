const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const { Configs, CustomCommands } = require("../../database/schemas");
const { _ } = require("../../utils/localization");
const { validateCommandPrefix } = require("../../utils/stringFunctions");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("custom-commands-add")
    .setDescription("Custom Commands Add")
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

    const name = interaction.options.getString("name");
    const response = interaction.options.getString("response");
    const prefix = interaction.options.getString("prefix") || "!";

    const customCommandsQuery = await CustomCommands.findOne({
      server: serverId,
      name: name,
    });

    if (prefix && !validateCommandPrefix(prefix))
      return await interaction.reply({
        content:
          "The command prefix can only be !, _, -, + or . (exclamation, underscore, hypen, plus, and dot) it could be.",
        ephemeral: true,
      });

    if (customCommandsQuery)
      return await interaction.reply({
        content: "This command already exists",
      });

    const newCustomCommands = new CustomCommands({
      server: serverId,
      prefix: prefix,
      name: name,
      response: response,
    });

    const addCustomCommands = await newCustomCommands.save();

    if (!addCustomCommands)
      return await interaction.reply({
        content: "Failed to add custom command",
        ephemeral: true,
      });

    return await interaction.reply({
      content: "Custom command added successfully",
      ephemeral: true,
    });
  },
};
