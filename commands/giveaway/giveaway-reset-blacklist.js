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
    .setName("giveaway-reset-blacklist")
    .setDescription("Reset blacklist")
    .addStringOption((option) =>
      option.setName("code").setDescription("Giveaway code").setRequired(true)
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

    giveaway.blacklist = [];

    const resetGiveawayBlacklist = await giveaway.save();

    if (!resetGiveawayBlacklist)
      return await interaction.reply({
        content: "Can not reset blacklist",
        ephemeral: true,
      });

    return await interaction.reply({
      content: "Blacklist reset successfully",
      ephemeral: true,
    });
  },
};
