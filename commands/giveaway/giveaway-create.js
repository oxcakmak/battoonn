const {
  ChannelType,
  EmbedBuilder,
  ReactionCollector,
  PermissionsBitField,
  SlashCommandBuilder,
} = require("discord.js");
const { Giveaways } = require("../../database/schemas");
const { _ } = require("../../utils/localization");
const {
  formattedCurrentDateTime,
  addTime,
  formatTimeDuration,
} = require("../../utils/dateFunctions");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("giveaway-create")
    .setDescription("Allows you to create giveaways")
    .addStringOption((option) =>
      option
        .setName("duration")
        .setDescription(
          "i=Minutes, h=Hours, d=Days, w=Weeks, m=Months, y=Years"
        )
        .setRequired(true)
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

    const voice = interaction.options.getChannel("voice")?.id;
    const role = interaction.options.getRole("role")?.id;
    const winners = interaction.options.getString("winners") || 1;
    const reserves = interaction.options.getString("reserves") || 0;
    const limit = interaction.options.getString("limit") || 1000000;
    const duration = interaction.options.getString("duration") || "1i";
    const channel = interaction.channel;
    const description =
      interaction.options.getString("description") ||
      _("giveaway_join_message_with_emoji");

    if (!duration || typeof duration !== "string")
      return await interaction.reply({
        content: "Invalid time string provided.",
        ephemeral: true,
      });

    const timeMatch = duration.match(/^(\d+)([ihwdmy])$/i); // Regular expression for time string format validation
    if (!timeMatch)
      return await interaction.reply({
        content: `Invalid time string format: ${duration}`,
        ephemeral: true,
      });

    try {
      const startAt = addTime("1i");
      const endAt = addTime(duration);

      const newGiveaways = await new Giveaways({
        server: serverId,
        channelId: channel.id,
        voiceId: voice ? voice : null,
        description: description,
        winners: winners,
        reserves: reserves,
        joinerRole: role,
        limit: limit,
        endAt: endAt,
        createdById: interaction.member.id,
        createdByDateTime: startAt,
        createdByChannel: channel.id,
      });

      await newGiveaways.save().then(async (doc) => {
        const embed = {
          embeds: [
            {
              title: _("giveaway_number_with_variable", { number: doc.code }),
              description: description,
              fields: [
                {
                  name: "Giveaway Duration",
                  value: formatTimeDuration(duration),
                  inline: true,
                },
                {
                  name: "Ends In",
                  value: endAt,
                  inline: true,
                },
                { name: "", value: "" },
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
                { name: "", value: "" },
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
                { name: "", value: "" },
                {
                  name: "Participants",
                  value: "0",
                  inline: true,
                },
                {
                  name: "Max Participants",
                  value: limit ? limit : "-",
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
                  value: formattedCurrentDateTime(),
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
            },
          ],
          components: [
            {
              type: 1,
              components: [
                {
                  style: 3,
                  label: "🎉",
                  custom_id: `btnJoinGiveaway-${doc.code}`,
                  disabled: false,
                  type: 2,
                },
              ],
            },
          ],
          /* timestamp: 1714330395290, */
        };

        await channel.send(embed).then(async (message) => {
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
          await giveaway.save();
        });
      });
    } catch (e) {
      console.log("Error: ", e);
    }
  },
};
