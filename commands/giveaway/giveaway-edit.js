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
    .setName("giveaway-edit")
    .setDescription(_("open_explorer_module"))
    .addStringOption((option) =>
      option.setName("code").setDescription("Giveaway code").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription(
          "Section where you can give information about the giveaway"
        )
    )
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription(
          "Role-specific giveaway setting, enter roles if you want specific role groups to participate"
        )
    )
    .addChannelOption((option) =>
      option
        .setName("voice")
        .setDescription(
          "Section set up for voice room events (radio, christmas etc.)"
        )
        .addChannelTypes(ChannelType.GuildVoice)
    )
    .addStringOption((option) =>
      option
        .setName("winners")
        .setDescription("Number of winners")
        .setMinLength(1)
    )
    .addStringOption((option) =>
      option
        .setName("reserves")
        .setDescription("Number of reserves other than the winner")
        .setMinLength(1)
    )
    .addStringOption((option) =>
      option
        .setName("limit")
        .setDescription(
          "Giveaway participation limit, leave blank for unlimited participants"
        )
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
    const voice = interaction.options.getChannel("voice")?.id;
    const role = interaction.options.getRole("role")?.id;
    const winners = interaction.options.getString("winners");
    const reserves = interaction.options.getString("reserves");
    const limit = interaction.options.getString("limit");
    const duration = interaction.options.getString("duration");
    const description =
      interaction.options.getString("description") ||
      _("giveaway_join_message_with_emoji");

    const giveaway = await Giveaways.findOne({
      server: serverId,
      code: code,
    });

    if (!giveaway)
      return await interaction.reply({
        content: "Giveaway not found",
        ephemeral: true,
      });

    if (limit && winners && winners >= limit)
      return await interaction.reply({
        content:
          "You cannot participate because the number of participants has been exceeded",
        ephemeral: true,
      });

    if (voice) giveaway.voiceId = voice;
    if (winners) giveaway.winners = winners;
    if (reserves) giveaway.reserves = reserves;
    if (duration) giveaway.duration = duration;
    if (role) giveaway.role = role;
    if (limit) giveaway.limit = limit;
    if (description) giveaway.description = description;

    const updateGiveaway = await giveaway.save();

    if (!updateGiveaway)
      return await interaction.reply({
        content: "Giveaway not updated",
        ephemeral: true,
      });

    return await interaction.reply({
      content: "Giveaway updated",
      ephemeral: true,
    });
  },
};
