const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");
const { Giveaways } = require("../../database/schemas");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("giveaway-info")
    .setDescription("Provides information about the giveaway")
    .addStringOption((option) =>
      option
        .setName("code")
        .setDescription("Enter code for giveaway information")
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

    const code = interaction.options.getString("code");

    const Giveaway = await Giveaways.findOne({
      server: interaction.guild.id,
      code: code,
    });

    if (!Giveaway)
      return await interaction.reply({
        content: "Giveaway not found",
        ephemeral: true,
      });

    return await interaction.reply({
      embeds: [
        {
          title: "Giveaway Info",
          description: Giveaway.description,
          fields: [
            {
              name: "Starts In",
              value: Giveaway.startAt,
              inline: true,
            },
            {
              name: "Ends In",
              value: Giveaway.endAt,
              inline: true,
            },
            { name: " ", value: " " },
            {
              name: "Join Role Required",
              value: Giveaway.role ? "Yes" : "No",
              inline: true,
            },
            {
              name: "Joiner Role",
              value: Giveaway.role ? `<@${Giveaway.role}>` : "-",
              inline: true,
            },
            { name: " ", value: " " },
            {
              name: "Winners",
              value: Giveaway.winners,
              inline: true,
            },
            {
              name: "Reserves",
              value: Giveaway.reserves,
              inline: true,
            },
            { name: " ", value: " " },
            {
              name: "Participants",
              value: Giveaway.participants.length,
              inline: true,
            },
            {
              name: "Max Participants",
              value: Giveaway.limit ? Giveaway.limit : "-",
              inline: true,
            },
            { name: " ", value: " " },
            {
              name: "Created By",
              value: `<@${Giveaway.createdById}>`,
              inline: true,
            },
            {
              name: "Created Date & Time",
              value: Giveaway.createdByDateTime,
              inline: true,
            },
            { name: " ", value: " " },
            {
              name: "Primary Winners",
              value: Giveaway.reservesList
                ? Giveaway.winnersList
                    .map(
                      (item, index) => `${index + 1}. ${item.replace("u", "")}`
                    )
                    .join("\n")
                : "-",
              inline: true,
            },
            {
              name: "Secondary Winners",
              value: Giveaway.reservesList
                ? Giveaway.reservesList
                    .map(
                      (item, index) => `${index + 1}. ${item.replace("u", "")}`
                    )
                    .join("\n")
                : "-",
              inline: true,
            },
          ],
        },
      ],
    });
  },
};
