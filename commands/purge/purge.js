const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription(_("delete_messages"))
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription(_("number_messages_to_delete_count_maximum_default"))
        .setMinValue(1)
        .setMaxValue(50)
    ),
  async execute(interaction) {
    if (interaction.bot) return;

    if (interaction.options.data.length === 0)
      return await interaction.reply({
        embeds: [
          {
            type: "rich",
            title: _("purge_command"),
            description: _("delete_messages"),
            fields: [
              {
                name: _("fields"),
                value: `**limit**: ${_(
                  "number_messages_to_delete_count_maximum_default"
                )}`,
              },
              {
                name: _("example"),
                value:
                  "/purge `limit` - " +
                  _("command_use_purge_channel") +
                  " \n /purge-channel `Channel` `limit` - " +
                  _("command_use_purge_channel_amount") +
                  "  \n /purge-user `UsernameOrId` `limit` - " +
                  _("command_use_purge_channel_user_amount") +
                  " \n /purge-channel-in-user `Channel` `UsernameOrId` `limit` - " +
                  _("command_use_purge_channel_user"),
              },
              {
                name: _("attention"),
                value: `${_("not_entered_channel_operate_in_channel")} \n ${_(
                  "number_messages_to_delete_count_maximum_default"
                )}`,
              },
            ],
          },
        ],
      });

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

    try {
      // Fetch messages from the target channel
      const messages = await targetChannel.messages.fetch();

      if (messages.size === 0)
        return await interaction.reply({
          content: _("message_not_found_to_delete"),
          ephemeral: true,
        });

      let messagesToDelete = [];

      messagesToDelete = await messages.first(deleteAmount);

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
