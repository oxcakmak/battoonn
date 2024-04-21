const { SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");
const { Configs } = require("../../database/schemas");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("announcement")
    .setDescription(_("send_announcement_message"))
    .addChannelOption((option) =>
      option.setName("channel").setDescription(_("filter_by_channel"))
    )
    .addStringOption((option) =>
      option.setName("message").setDescription(_("announcement_text"))
    ),
  async execute(interaction) {
    if (interaction.bot) return;

    const targetChannel = interaction.options.getChannel("channel");
    const message = interaction.options.getString("message");

    const configs = await Configs.findOne({
      server: interaction.guild.id,
    });

    if (!configs)
      return await interaction.reply({
        content: _("register_to_use_forum_commands"),
        ephemeral: true,
      });

    try {
      let targetId = targetChannel
        ? targetChannel.id
        : configs.announcementChannel;
      const channel = await interaction.guild.channels.fetch(targetId);

      if (!channel)
        return await interaction.reply({
          content: _("channel_not_found"),
          ephemeral: true,
        });

      const sendMessage = await channel.send({ content: message });

      if (!sendMessage)
        return await interaction.reply({
          content: _("announcement_message_not_sent"),
          ephemeral: true,
        });

      return await interaction.reply({
        content: _("announcement_message_sent"),
        ephemeral: true,
      });
    } catch (error) {
      console.log(error);
      return await interaction.reply({
        content: _("an_unknown_error_occurred"),
        ephemeral: true,
      });
    }
  },
};
