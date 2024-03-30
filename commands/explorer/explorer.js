const {
  PermissionsBitField,
  SlashCommandBuilder,
  ChannelType,
} = require("discord.js");
const { Configs, Explorers } = require("../../database/schemas");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("explorer")
    .setDescription(_("server_join_and_leave_member_transactions")),
  async execute(interaction) {
    if (interaction.bot) return;

    return await interaction.reply({
      embeds: [
        {
          type: "rich",
          title: _("explorer_command"),
          description: _("server_join_and_leave_member_transactions"),
          color: 0xffffff,
          fields: [
            {
              name: _("use_of"),
              value: `**module (enable/disable)**: ${_(
                "explorer_module_related_to_members"
              )} \n **type (join/leave)**: ${_(
                "process_type"
              )} \n **message**: ${_(
                "joining_or_leaving_mesage"
              )} \n **role**: ${_(
                "server_given_joining_role"
              )} \n **channel**: ${_(
                "chanel_notifications_send_to_joining_or_leaving_message"
              )}`,
            },
            {
              name: _("example"),
              value: `**/explorer module [enable/disable]** \n **/explorer role member** \n **/explorer join #visitors** \n **/explorer join Welcome %user%!** \n **/explorer leave #visitors** \n **/explorer leave Good bye %user%!**`,
            },
            {
              name: _("example"),
              value: _("user_code_tags"),
            },
          ],
        },
      ],
    });
  },
};
