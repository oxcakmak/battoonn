const {
  ChannelType,
  SlashCommandBuilder,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("vr-multiple-create")
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
        .setName("channel_count")
        .setDescription("The number of voice channels to create.")
        .setMinValue(1)
        .setMaxValue(20) // Adjust maximum as needed
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("name") // Optional prefix for dynamic naming
        .setDescription(
          'Optional prefix for the channel name (e.g., "Voice Chat - ").'
        )
        .setRequired(false)
    ),
  async execute(interaction) {
    const category = interaction.options.getChannel("category");
    const channelCount = interaction.options.getInteger("channel_count");
    const userLimit = interaction.options.getInteger("limit");
    const namePrefix = interaction.options.getString("name_prefix") || ""; // Optional prefix

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

    try {
      for (let i = 1; i <= channelCount; i++) {
        await interaction.guild.channels
          .create({
            type: 2,
            name: namePrefix ? namePrefix + " - " + i : i,
            parent: category.id,
            userLimit,
            permissionOverwrites: [
              {
                id: interaction.guild.roles.everyone,
                allow: [PermissionsBitField.Flags.ViewChannel], // Basic permissions for everyone
              },
            ],
          })
          .then((channel) => {
            console.log(channel.id);
          });
      }
      await interaction.reply({
        content: `Created voice channel "${namePrefix}" with limit ${userLimit} users.`,
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
