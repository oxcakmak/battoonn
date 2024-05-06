const {
  ChannelType,
  EmbedBuilder,
  ReactionCollector,
  PermissionsBitField,
  SlashCommandBuilder,
} = require("discord.js");
const { Giveaways } = require("../../database/schemas");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("giveaway-reset-participants")
    .setDescription("Reset participants")
    .addStringOption((option) =>
      option.setName("code").setDescription("Giveaway code").setRequired(true)
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

    const code = interaction.options.getString("code");

    const giveaway = await Giveaways.findOne({
      server: serverId,
      code: code,
    });

    if (!giveaway)
      return await interaction.reply({
        content: "Giveaway not found",
        ephemeral: true,
      });

    giveaway.participants = [];

    const resetGiveawayParticipants = await giveaway.save();

    if (!resetGiveawayParticipants)
      return await interaction.reply({
        content: "Can not reset participants",
        ephemeral: true,
      });

    return await interaction.reply({
      content: "Participants removed successfully",
      ephemeral: true,
    });
  },
};
