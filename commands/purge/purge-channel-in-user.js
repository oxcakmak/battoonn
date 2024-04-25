const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("purge-channel-in-user")
    .setDescription(_("delete_messages"))
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription(_("filter_by_channel"))
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription(_("filter_by_user"))
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription(_("number_messages_to_delete_count_maximum_default"))
        .setMinValue(1)
        .setMaxValue(50)
    ),
  async execute(interaction) {
    if (interaction.bot) return;

    // Check if the user has permission to manage messages
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.ManageMessages
      )
    ) {
      return await interaction.reply({
        content: _("you_do_not_have_permission_command"),
        ephemeral: true,
      });
    }

    const amount = interaction.options.getInteger("amount") || 50;
    const user = interaction.options.getUser("user")?.id;
    const channel = interaction.options.getChannel("channel");

    if (amount > 50 || amount < 1)
      return await interaction.reply({
        content: _("number_messages_to_delete_between_numbers", {
          min: 1,
          max: 50,
        }),
        ephemeral: true,
      });

    let messagesToDelete = [];
    let messageList = [];

    // Fetch messages efficiently (up to 100)
    const messages = await channel.messages.fetch();

    // Sort messages in descending order by timestamp (most recent first)
    // await messages.sort((a, b) => b.createdTimestamp - a.createdTimestamp);

    messages.forEach(async (msg) => {
      if (msg.author.id === user) await messageList.push(msg);
    });

    for (let i = 0; i < messageList.length; i++) {
      if (messageList[i].author.id === user && i < amount)
        await messagesToDelete.push(messageList[i]);
    }

    if (messages.size === 0 || messageList.length === 0)
      return await interaction.reply({
        content: _("message_not_found_to_delete"),
      });

    try {
      await channel.bulkDelete(messagesToDelete, true);

      await interaction.reply({
        content: _("message_deleted_successfully"),
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: _("failed_to_delete_messages"),
        ephemeral: true,
      });
    }
  },
};
