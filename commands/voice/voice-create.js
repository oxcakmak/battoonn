const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("voice-create")
    .setDescription(
      "Creates a voice channel in a category with a limit and dynamic name."
    )
    .addStringOption((option) =>
      option
        .setName("category_id")
        .setDescription("The ID of the category to create the channel in.")
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
        .setName("channel_count")
        .setDescription("The number of voice channels to create.")
        .setMinValue(1)
        .setMaxValue(20) // Adjust maximum as needed
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("name_prefix") // Optional prefix for dynamic naming
        .setDescription(
          'Optional prefix for the channel name (e.g., "Voice Chat - ").'
        )
        .setRequired(false)
    ),
  async execute(interaction) {
    const categoryId = interaction.options.getString("category_id");
    const channelCount = interaction.options.getInteger("channel_count");
    const userLimit = interaction.options.getInteger("limit");
    const namePrefix = interaction.options.getString("name_prefix") || ""; // Optional prefix

    const category = interaction.guild.channels.cache.get(categoryId);
    if (
      !category &&
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      return await interaction.reply({
        content: "Invalid category ID or missing permissions.",
        ephemeral: true,
      });
    }

    try {
      for (let i = 1; i <= channelCount; i++) {
        await interaction.guild.channels.create({
          type: 2,
          name: namePrefix + " - " + i,
          parent: category,
          userLimit,
          permissionOverwrites: [
            {
              id: interaction.guild.roles.everyone,
              allow: [PermissionsBitField.Flags.ViewChannel], // Basic permissions for everyone
            },
          ],
        });
      }
      await interaction.reply({
        content: `Created voice channel "${channelName}" with limit ${userLimit} users.`,
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
