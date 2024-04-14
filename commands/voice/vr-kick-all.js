const {
  ChannelType,
  PermissionsBitField,
  SlashCommandBuilder,
} = require("discord.js");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("vr-kick-all")
    .setDescription(_("move_user_to_voice_channel"))
    .addChannelOption((option) =>
      option
        .setName("from")
        .setDescription(_("which_channel_should_move"))
        .addChannelTypes(ChannelType.GuildVoice)
        .setRequired(true)
    ),
  async execute(interaction) {
    if (interaction.bot) return;

    const sourceChannelId = interaction.options.getChannel("from").id;

    const sourceChannel = interaction.guild.channels.cache.get(sourceChannelId);

    if (
      (!sourceChannel || !sourceChannel.type !== 2) &&
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await interaction.reply({
        content: "Invalid channel ID or missing permissions.",
        ephemeral: true,
      });

    try {
      for (const [, member] of sourceChannel.members) {
        if (!member.voice.channelId) continue; // Skip members not in voice channel
        await member.voice.disconnect();
      }

      await interaction.reply({
        content: "Successfully kicked!",
        ephemeral: true,
      });
    } catch (error) {
      console.error("Error moving users:", error);
      await interaction.reply({
        content: "An error occurred while moving users!",
        ephemeral: true,
      });
    }
  },
};
