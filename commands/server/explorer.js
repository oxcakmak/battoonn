const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const { Explorer } = require("../../database/schemas/schema-explorer");
const { _ } = require("../../utils/localization");

module.exports = {
  cooldowns: 5,
  data: new SlashCommandBuilder()
    .setName("explorer")
    .setDescription(_("server_join_and_leave_member_transactions"))
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription(_("process_type"))
        .addChoices(
          { name: _("joining"), value: "join" },
          { name: _("leaving"), value: "leave" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("module")
        .setDescription(_("module"))
        .addChoices(
          { name: _("enable"), value: "true" },
          { name: _("disable"), value: "false" }
        )
    )
    .addStringOption((option) =>
      option.setName("message").setDescription(_("message"))
    )
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription(_("given_role_joining_or_leaving_mesage"))
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription(
          _("chanel_notifications_send_to_joining_or_leaving_mesage")
        )
    ),
  async execute(interaction) {
    // Check if the user has permission to manage messages
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await interaction.reply({
        content: _("you_do_not_have_permission_command"),
        ephemeral: true,
      });

    const serverId = interaction.guild.id;
    const explorer = await Explorer.findOne({ server: serverId });
    const explorerType = interaction.options.getString("type");
    const moduleEnabled = interaction.options.getString("module");
    const message = interaction.options.getString("message");
    const givenRole = interaction.options.getRole("role");
    const notifyChannel = interaction.options.getChannel("channel");

    if (explorer) {
      if (!explorer.moduleEnabled) {
        return await interaction.reply({
          content: _("activate_module_first"),
          ephemeral: true,
        });
      } else {
        console.log(moduleEnabled);
        /*
        if (moduleEnabled) explorer.moduleEnabled = moduleEnabled;

        if (givenRole) explorer.givenRole = givenRole;
        if (notifyChannel) explorer.notifyChannel = notifyChannel;

        if (explorerType == "join" && message) explorer.joinMessage = message;
        if (explorerType == "leave" && message) explorer.leaveMessage = message;

        const explorerUpdate = await explorer.save();
        if (!explorerUpdate)
          return await interaction.reply({
            content: _("server_already_saved"),
            ephemeral: true,
          });
*/
        return await interaction.reply({
          content: _("server_already_saved"),
          ephemeral: true,
        });
      }
    } else {
      const newExplorer = new Explorer({
        server: serverId,
      });

      const savedExplorer = await newExplorer.save();

      if (!savedExplorer)
        return await interaction.reply({
          content: _("explorer_registration_failed"),
          ephemeral: true,
        });

      return await interaction.reply({
        content: _("explorer_registration_successful"),
        ephemeral: true,
      });
    }
  },
};
