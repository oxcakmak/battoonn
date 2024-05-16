const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("purge-user")
    .setDescription(_("delete_messages"))
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

    const amount = interaction.options.getInteger("amount");
    const user = interaction.options.getUser("user");

    // Determine the channel to delete messages from
    const targetChannel = interaction.channel;
    const deleteAmount = amount ? amount : 50;

    if (deleteAmount > 50 || deleteAmount < 1)
      return await interaction.reply({
        content: _("number_messages_to_delete_between_numbers", {
          min: 1,
          max: 50,
        }),
        ephemeral: true,
      });

    // Fetch messages efficiently (up to 100)
    const messages = await channel.messages.fetch({ limit: 100 });

    // Sort messages in descending order by timestamp (most recent first)
    // await messages.sort((a, b) => b.createdTimestamp - a.createdTimestamp);

    messages.forEach(async (msg) => {
      if (msg.author.id === user) await messageList.push(msg);
    });

    for (let i = 0; i < messageList.length; i++) {
      if (messageList[i].author.id === user && i < amount)
        await messagesToDelete.push(messageList[i]);
    }

    try {
      // Fetch messages from the target channel
      const messages = await targetChannel.messages.fetch();

      if (messages.size === 0)
        return await interaction.reply({
          content: _("message_not_found_to_delete"),
        });

      let messagesToDelete = [];

      if (messagesToDelete.length > 0) {
        await targetChannel.bulkDelete(messagesToDelete, true);
        await interaction.reply({
          content: _("message_deleted_successfully"),
          ephemeral: true,
        });
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: _("failed_to_delete_messages"),
        ephemeral: true,
      });
    }
  },
};
