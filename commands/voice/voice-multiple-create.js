const {
  ChannelType,
  SlashCommandBuilder,
  PermissionsBitField,
} = require("discord.js");
const ascii = require("ascii-table");
const { VoiceRooms } = require("../../database/schemas");
const { formattedCurrentDateTime } = require("../../utils/dateFunctions");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("voice-multiple-create")
    .setDescription(
      "Creates a voice channel in a category with a limit and dynamic name."
    )
    .addChannelOption((option) =>
      option
        .setName("category")
        .setDescription("The ID of the category to create the channel in.")
        .addChannelTypes(ChannelType.GuildCategory)
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("limit")
        .setDescription("The maximum number of users allowed in the channel.")
        .setMinValue(1)
        .setMaxValue(99)
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("count")
        .setDescription("The number of voice channels to create.")
        .setMinValue(1)
        .setMaxValue(20)
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription(
          'Optional prefix for the channel name (e.g., "Voice Chat - ").'
        )
        .setRequired(false)
    ),
  async execute(interaction) {
    const category = interaction.options.getChannel("category");
    const count = interaction.options.getInteger("count");
    const limit = interaction.options.getInteger("limit");
    const name = interaction.options.getString("name") || "Voice";

    const targetCategory = interaction.guild.channels.cache.get(category.id);
    if (
      !targetCategory &&
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      return await interaction.reply({
        content: "Invalid category ID or missing permissions.",
        ephemeral: true,
      });
    }

    const table = new ascii("Multiple Voice Room Create")
      .setHeading("Order", "Name", "ID")
      .setHeadingAlignCenter();

    try {
      let createVoiceRooms;
      for (let i = 1; i <= count; i++) {
        let voiceName = name ? name + " - " + i : i;
        await interaction.guild.channels
          .create({
            type: 2,
            name: voiceName,
            parent: category.id,
            userLimit: limit,
            permissionOverwrites: [
              {
                id: interaction.guild.roles.everyone,
                allow: [PermissionsBitField.Flags.ViewChannel], // Basic permissions for everyone
              },
            ],
          })
          .then(async (channel) => {
            createVoiceRooms = await new VoiceRooms({
              server: interaction.guild.id,
              channel: channel.id,
              name: voiceName,
              primaryOwnerId: "-",
              secondaryOwnerId: "-",
              createdById: interaction.client.user.id,
              createdDateTime: formattedCurrentDateTime(),
            });
            table.addRow(i, voiceName, channel.id);
          });
        await createVoiceRooms.save();
      }

      await interaction.reply({
        content: "```\n" + table.toString() + "```",
        ephemeral: true,
      });
    } catch (error) {
      console.error("Error creating voice channel:", error);
      await interaction.reply({
        content: "An error occurred while creating the voice channel.",
        ephemeral: true,
      });
    }
  },
};
