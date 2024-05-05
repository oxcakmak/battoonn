const {
  ChannelType,
  EmbedBuilder,
  ReactionCollector,
  PermissionsBitField,
  SlashCommandBuilder,
} = require("discord.js");
const { Giveaways } = require("../../database/schemas");
const { _ } = require("../../utils/localization");

const time = new Date().toLocaleString("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

module.exports = {
  data: new SlashCommandBuilder()
    .setName("giveaway-edit")
    .setDescription(_("open_explorer_module"))
    .addStringOption((option) =>
      option
        .setName("code")
        .setDescription(_("filter_by_role"))
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("description").setDescription(_("filter_by_role"))
    )
    .addRoleOption((option) =>
      option.setName("role").setDescription(_("filter_by_role"))
    )
    .addChannelOption((option) =>
      option
        .setName("voice")
        .setDescription(_("which_channel_should_move"))
        .addChannelTypes(ChannelType.GuildVoice)
    )
    .addStringOption((option) =>
      option
        .setName("winners")
        .setDescription(_("filter_by_role"))
        .setMinLength(1)
    )
    .addStringOption((option) =>
      option
        .setName("reserves")
        .setDescription(_("filter_by_role"))
        .setMinLength(1)
    )
    .addStringOption((option) =>
      option.setName("limit").setDescription(_("filter_by_role"))
    )
    .addStringOption((option) =>
      option.setName("duration").setDescription(_("filter_by_role"))
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

    const voice = interaction.options.getChannel("voice")?.id;
    const role = interaction.options.getRole("role")?.id;
    const winners = interaction.options.getString("winners");
    const reserves = interaction.options.getString("reserves");
    const limit = interaction.options.getString("limit");
    const duration = interaction.options.getString("duration");
    const channel = interaction.channel;
    const description =
      interaction.options.getString("description") ||
      _("giveaway_join_message_with_emoji");

    const roleIds = await interaction.member.roles.cache.map((role) => role.id);

    const newGiveaways = await new Giveaways({
      server: serverId,
      voiceId: voice ? voice : null,
      winnerPrimaryCount: winners,
      winnerSecondaryCount: reserves,
      duration: duration,
      joinerRole: role,
      maxParticipants: limit,
      isFinished: false,
      createdById: interaction.member.id,
      createdByDateTime: time,
      createdByChannel: channel.id,
    });

    await newGiveaways.save();

    const giveaway = await Giveaways.findOne({
      server: serverId,
      code: doc.code,
    });

    // Update Giveaway messageId
    giveaway.messageId = message.id;
    await giveaway.save();

    if (participantCount >= limit)
      return await interaction.reply({
        content:
          "You cannot participate because the number of participants has been exceeded",
        ephemeral: true,
      });

    if (role && !containsMultipleData(roleIds, [role]))
      return await interaction.reply({
        content: "You must have role xx to participate in the giveaway",
        ephemeral: true,
      });

    if (giveaway.participants.includes(user.id))
      return await interaction.reply({
        content: "You have already entered the giveaway",
        ephemeral: true,
      });

    if (giveaway.blacklist.includes(user.id))
      return await interaction.reply({
        content:
          "You cannot participate in the draw because you are on the blacklist",
        ephemeral: true,
      });

    const member = interaction.guild.members.cache.get(message.author.id);

    if (voice && member.voice.channel.id !== voice)
      return await interaction.reply({
        content: "You are not currently in a voice channel",
        ephemeral: true,
      });

    giveaway.participants.push(user.id);

    await giveaway.save();
  },
};
