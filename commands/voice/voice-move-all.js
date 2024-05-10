const {
  ChannelType,
  PermissionsBitField,
  SlashCommandBuilder,
} = require("discord.js");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("voice-move-all")
    .setDescription(_("move_user_to_voice_channel"))
    .addChannelOption((option) =>
      option
        .setName("from")
        .setDescription(_("which_channel_should_move"))
        .addChannelTypes(ChannelType.GuildVoice)
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("to")
        .setDescription(_("which_channel_should_move"))
        .addChannelTypes(ChannelType.GuildVoice)
        .setRequired(true)
    ),
  async execute(interaction) {
    if (interaction.bot) return;

    const sourceChannelId = interaction.options.getChannel("from").id;
    const destinationChannelId = interaction.options.getChannel("to").id;

    const sourceChannel = interaction.guild.channels.cache.get(sourceChannelId);
    const destinationChannel =
      interaction.guild.channels.cache.get(destinationChannelId);

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await interaction.reply({
        content: "Invalid channel ID or missing permissions.",
        ephemeral: true,
      });

    if (!sourceChannel || !destinationChannel) {
      return await interaction.reply({
        content: "Invalid source or destination channel!",
        ephemeral: true,
      });
    }

    if (!sourceChannel.joinable) {
      return await interaction.reply({
        content: "I cannot join the source channel!",
        ephemeral: true,
      });
    }

    if (!destinationChannel.joinable) {
      return await interaction.reply({
        content: "I cannot join the destination channel!",
        ephemeral: true,
      });
    }

    try {
      for (const [, member] of sourceChannel.members) {
        if (!member.voice.channelId) continue; // Skip members not in voice channel
        await member.voice.setChannel(destinationChannel);
      }

      await interaction.reply({
        content: "Successfully moved all users to the destination channel!",
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
