const {
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
    .setName("giveaway-create")
    .setDescription(_("open_explorer_module"))
    .addChannelOption((option) =>
      option.setName("channel").setDescription(_("filter_by_channel"))
    )
    .addStringOption((option) =>
      option.setName("description").setDescription(_("filter_by_role"))
    )
    .addRoleOption((option) =>
      option.setName("required_join_role").setDescription(_("filter_by_role"))
    )
    .addStringOption((option) =>
      option
        .setName("main_winners")
        .setDescription(_("filter_by_role"))
        .setMinLength(1)
    )
    .addStringOption((option) =>
      option
        .setName("reserve_winners")
        .setDescription(_("filter_by_role"))
        .setMinLength(1)
    )
    .addStringOption((option) =>
      option.setName("participant_limit").setDescription(_("filter_by_role"))
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

    const requiredJoinRole =
      interaction.options.getRole("required_join_role")?.id;
    const mainWinners = interaction.options.getString("main_winners");
    const reserveWinners = interaction.options.getString("reserve_winners");
    const participantLimit = interaction.options.getString("participant_limit");
    const duration = interaction.options.getString("duration");
    const channel =
      interaction.options.getChannel("channel") || interaction.channel;
    const description =
      interaction.options.getString("description") ||
      _("giveaway_join_message_with_emoji");

    const targetChannel = await interaction.guild.channels.fetch(channel.id);

    if (!targetChannel)
      return await interaction.reply({
        content: _("channel_not_found"),
        ephemeral: true,
      });

    const roleIds = await interaction.member.roles.cache.map((role) => role.id);

    if (requiredJoinRole && !containsMultipleData(roleIds, [requiredJoinRole]))
      return await interaction.reply({
        content: _("you_do_not_have_permission_command"),
        ephemeral: true,
      });

    const newGiveaways = await new Giveaways({
      server: serverId,
      winnerPrimaryCount: mainWinners,
      winnerSecondaryCount: reserveWinners,
      duration: duration,
      joinerRole: requiredJoinRole,
      maxParticipants: participantLimit,
      isFinished: false,
      createdById: interaction.member.id,
      createdByDateTime: time,
      createdByChannel: interaction.channel.id,
    });

    await newGiveaways.save().then(async (doc) => {
      const embed = new EmbedBuilder({
        title: _("giveaway_number_with_variable", { number: doc.code }),
        description: description,
        fields: [
          {
            name: "Giveaway Duration",
            value: "1 Day",
            inline: true,
          },
          {
            name: "Ends In",
            value: "Apr 28, 2024, 10:10 PM",
            inline: true,
          },
          { name: "", value: "" },
          {
            name: "Join Role Required",
            value: requiredJoinRole ? requiredJoinRole : "-",
            inline: true,
          },
          {
            name: "Joiner Role",
            value: requiredJoinRole ? `<@${requiredJoinRole}>` : "-",
            inline: true,
          },
          { name: "", value: "" },
          {
            name: "Participants",
            value: "0",
            inline: true,
          },
          {
            name: "Max Participants",
            value: participantLimit ? participantLimit : "-",
            inline: true,
          },
          { name: "", value: "" },
          {
            name: "Created By",
            value: `<@${interaction.member.id}>`,
            inline: true,
          },
          {
            name: "Created Date & Time",
            value: time,
            inline: true,
          },
          /*
          { name: "", value: "" },
          {
            name: "Primary Winners",
            value: "-",
            inline: true,
          },
          {
            name: "Secondary Winners",
            value: "-",
            inline: true,
          },
          */
        ],
        /* timestamp: 1714330395290, */
      });

      await targetChannel
        .send({
          embeds: [embed],
        })
        .then(async (message) => {
          // Attempt to delete the initial reply message (optional)
          await interaction.deferReply();
          // Delete the original slash command reply
          await interaction.deleteReply();

          const giveaway = await Giveaways.findOne({
            server: serverId,
            code: doc.code,
          });

          // Update Giveaway messageId
          giveaway.messageId = message.id;

          await message.react("🎉");

          // Collect all reactions
          const collector = await message.createReactionCollector({
            filter: (reaction, user) =>
              reaction.emoji.name === "🎉" && user.id !== message.author.id,
            max: participantLimit,
          });

          await collector.on("collect", (reaction, user) => {
            if (
              !giveaway.participants.includes(user.id) ||
              !giveaway.blacklist.includes(user.id)
            )
              giveaway.participants.push(user.id);
          });

          await giveaway.save();
        });
    });
  },
};
