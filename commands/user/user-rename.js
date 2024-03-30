const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const { Explorers } = require("../../database/schemas");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("user-rename")
    .setDescription(_("adds_tags_the_beginning_end_of_username"))
    .addStringOption((option) =>
      option
        .setName("position")
        .setDescription(_("where_to_add_tags"))
        .addChoices(
          { name: _("beginning_of_username"), value: "per" },
          { name: _("end_of_username"), value: "end" }
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("tag")
        .setDescription(_("what_tag_should_you_add"))
        .setRequired(true)
        .setMaxLength(25)
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

    const serverId = interaction.guild.id;

    const position = interaction.options.getString("position");
    const tag = interaction.options.getString("tag");

    const explorerQuery = await Explorers.findOne({ server: serverId });

    if (!explorerQuery)
      return await interaction.reply({
        content: _("explorer_registration_failed"),
        ephemeral: true,
      });

    return await interaction.reply({
      content: _("explorer_registration_successful"),
      ephemeral: true,
    });
  },
};
