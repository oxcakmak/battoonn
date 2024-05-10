const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const { VoiceRooms } = require("../../database/schemas");
const { _ } = require("../../utils/localization");
const ascii = require("ascii-table");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("voice-destroy")
    .setDescription("Close all channels opened by the bot"),
  async execute(interaction) {
    if (interaction.bot) return;

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await interaction.reply({
        content: "Invalid channel ID or missing permissions.",
        ephemeral: true,
      });

    const voiceRooms = await VoiceRooms.find({
      server: interaction.guild.id,
      createdById: interaction.client.user.id,
    });

    if (!voiceRooms || voiceRooms.length === 0)
      return await interaction.reply({
        content: "Not found to delete voice room",
        ephemeral: true,
      });

    const table = new ascii("Deleted Voice Rooms")
      .setHeading("Order", "Name", "ID")
      .setHeadingAlignCenter();

    try {
      voiceRooms.forEach(async (voiceRoom, index) => {
        table.addRow(index + 1, voiceRoom.name, voiceRoom.channel);

        const channel = await interaction.guild.channels.fetch(
          voiceRoom.channel
        );

        await VoiceRooms.deleteOne({
          server: interaction.guild.id,
          channel: voiceRoom.channel,
          createdById: interaction.client.user.id,
        });

        await channel.delete();
      });

      return await interaction.reply({
        content: "```\n" + table.toString() + "```",
        ephemeral: true,
      });
    } catch (error) {
      console.error("Error deleting voice channel:", error);
    }
  },
};
