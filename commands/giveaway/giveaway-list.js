const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");
const { Giveaways } = require("../../database/schemas");

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

    return await interaction.reply({
      embeds: [
        {
          title: "Giveaway List",
          description: "See you all giveaways last 10",
          fields: [
            {
              name: "#",
              value: "1",
              inline: true,
            },
            {
              name: "Code",
              value: "23525",
              inline: true,
            },
            {
              name: "Winners - Reserves - Limit - Start / End",
              value: "1 / 1 / 50 / ",
              inline: true,
            },
          ],
        },
      ],
    });
  },
};
