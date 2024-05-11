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
    .addRoleOption((option) =>
      option
        .setName("vrole")
        .setDescription(
          "The role you will be given when joining the voice channel"
        )
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
    const vrole = interaction.options.getChannel("vrole")?.id;
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
    if (vrole) giveaway.voiceRole = vrole;
    if (winners) giveaway.winners = winners;
    if (reserves) giveaway.reserves = reserves;
    if (duration) giveaway.duration = duration;
    if (role) giveaway.role = role;
    if (limit) giveaway.limit = limit;
    if (description) giveaway.description = description;

    const fetchedMessage = await message.channel.messages.fetch(messageId);

    if (!fetchedMessage.embeds.length)
      return await interaction.reply({
        content: "The message does not contain an embed",
        ephemeral: true,
      });

    const embed = {
      embeds: [
        {
          title: _("giveaway_number_with_variable", { number: code }),
          description: description
            ? description
            : _("giveaway_join_message_with_emoji"),
          fields: [
            {
              name: "Starts In",
              value: startAt,
              inline: true,
            },
            {
              name: "Giveaway Duration",
              value: duration ? formatTimeDuration(duration) : "",
              inline: true,
            },
            {
              name: "Ends In",
              value: endAt,
              inline: true,
            },
            { name: "\u200b", value: "" },
            {
              name: "Voice Required",
              value: voice ? "Yes" : "No",
              inline: true,
            },
            {
              name: "Voice Channel",
              value: voice ? `<#${voice}>` : "-",
              inline: true,
            },
            {
              name: "Role to be Given",
              value: voice && vrole ? `<@&${vrole}>` : "-",
              inline: true,
            },
            { name: "\u200b", value: "" },
            {
              name: "Join Role Required",
              value: role ? "Yes" : "No",
              inline: true,
            },
            {
              name: "Joiner Role",
              value: role ? `<@${role}>` : "-",
              inline: true,
            },
            { name: "\u200b", value: "" },
            {
              name: "Winners",
              value: winners,
              inline: true,
            },
            {
              name: "Reserves",
              value: reserves,
              inline: true,
            },
            { name: "\u200b", value: "" },
            {
              name: "Participants",
              value: participants.length + 1,
              inline: true,
            },
            {
              name: "Max Participants",
              value: limit,
              inline: true,
            },
            { name: "\u200b", value: "" },
            {
              name: "Created By",
              value: `<@${createdById}>`,
              inline: true,
            },
            {
              name: "Created Date & Time",
              value: createdByDateTime,
              inline: true,
            },
          ],
        },
      ],
      components: [],
    };
    try {
      await fetchedMessage.edit(embed);
    } catch (e) {
      console.log(e.message);
    }

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
