const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");
const { Giveaways } = require("../../database/schemas");
const ascii = require("ascii-table");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("giveaway-list")
    .setDescription("Provides information about the giveaway"),
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

    const Giveaway = await Giveaways.find({ server: interaction.guild.id })
      .sort({
        createdByDateTime: -1,
      })
      .limit(20);

    if (!Giveaway)
      return await interaction.reply({
        content: "Giveaway not found",
        ephemeral: true,
      });

    const table = new ascii("See you all giveaways last 10")
      .setHeading(
        "Order",
        "Code",
        "Winners",
        "Reserves",
        "Participants",
        "Limit",
        "Start",
        "End",
        "Status"
      )
      .setHeadingAlignCenter();

    Giveaway.forEach((giveaway, index) => {
      table.addRow(
        index + 1,
        giveaway.code,
        giveaway.winners,
        giveaway.reserves,
        giveaway.participants.length,
        giveaway.limit,
        giveaway.startAt,
        giveaway.endAt,
        giveaway.ended ? "Ended" : "Continues"
      );
    });

    return await interaction.reply({
      content: "```\n" + table.toString() + "```",
    });
  },
};
