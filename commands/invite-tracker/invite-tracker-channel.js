const {
  PermissionsBitField,
  SlashCommandBuilder,
  ChannelType,
} = require("discord.js");
const { InviteTrackerConfigs } = require("../../database/schemas");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("invite-tracker-channel")
    .setDescription(
      _("chanel_notifications_send_to_joining_or_leaving_message")
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription(
          _("chanel_notifications_send_to_joining_or_leaving_message")
        )
        .addChannelTypes(ChannelType.GuildText)
    ),
  async execute(interaction) {
    if (interaction.bot) return;

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

    const channel = interaction.options.getChannel("channel");

    const inviteTrackerConfig = await InviteTrackerConfigs.findOne({
      server: serverId,
    });

    if (!inviteTrackerConfig)
      return await interaction.reply({
        content: _("register_as_an_explorer"),
      });

    if (interaction.options.data.length === 0)
      return await interaction.reply({
        content: `<#${inviteTrackerConfig.channel}>`,
        ephemeral: true,
      });

    inviteTrackerConfig.channel = channel.id;

    const inviteTrackerUpdate = await inviteTrackerConfig.save();
    if (!inviteTrackerUpdate)
      return await interaction.reply({
        content: _("explorer_settings_updated_failed"),
        ephemeral: true,
      });

    return await interaction.reply({
      content: _("explorer_settings_updated_success"),
    });
  },
};
