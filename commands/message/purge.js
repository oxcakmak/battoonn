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
    )
    .addUserOption((option) =>
      option.setName("user").setDescription(_("filter_by_user"))
    )
    .addChannelOption((option) =>
      option.setName("channel").setDescription(_("filter_by_channel"))
    ),
  async execute(interaction) {
    if (interaction.bot) return;

    // Command description
    if (interaction.options.data.length === 0)
      return await interaction.reply({
        embeds: [
          {
            type: "rich",
            title: _("config_command"),
            description: _("delete_messages"),
            color: 0xffffff,
            fields: [
              {
                name: _("use_of"),
                value: `**channel**: ${_("filter_by_channel")} \n **user**: ${_(
                  "filter_by_user"
                )} \n **amount**: ${_(
                  "number_messages_to_delete_count_maximum_default"
                )}`,
              },
              {
                name: _("example"),
                value: `**/purge #general** \n **/purge battoonn** \n **/purge 25** \n **/purge #general 25 ** \n **/purge #general battoonn** \n **/purge #general battoonn 25** \n **/purge battoonn 25**`,
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

    const amount = interaction.options.getInteger("amount");
    const user = interaction.options.getUser("user");
    const channel = interaction.options.getChannel("channel");

    // Determine the channel to delete messages from
    const targetChannel = channel ? channel : interaction.channel;
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
        });

      let messagesToDelete = [];

      if (user) {
        let i = 0;
        messages.forEach(async (msg) => {
          if (
            msg.author.id === user.id &&
            messagesToDelete.length < deleteAmount
          ) {
            await messagesToDelete.push(msg);
            i++;
          }
        });
      } else {
        messagesToDelete = await messages.first(deleteAmount);
      }

      if (messagesToDelete.length > 0) {
        await targetChannel.bulkDelete(messagesToDelete, true);
        await interaction.reply({
          content: _("message_deleted_successfully"),
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
