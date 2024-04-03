const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");
const { Forums } = require("../../database/schemas");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("forum")
    .setDescription(_("forum_configuration_role_and_resolved_title"))
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription(_("forum_lock_unlock_edit_the_thread_title_role"))
    )
    .addStringOption((option) =>
      option.setName("title").setDescription(_("thread_untied_text"))
    ),

  async execute(interaction) {
    if (interaction.bot) return;

    if (interaction.options.data.length === 0)
      return await interaction.reply({
        embeds: [
          {
            type: "rich",
            title: _("forum"),
            description: _("forum_command"),
            fields: [
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

    // Check if the user has permission to ban members
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await interaction.reply({
        content: _("you_do_not_have_permission_command"),
        ephemeral: true,
      });

    try {
      const role = await interaction.options.getRole("role");
      const title = await interaction.options.getString("title");

      const checkRole = await interaction.guild.roles.cache.get(role);

      if (role && !checkRole)
        return await interaction.reply({
          content: _("role_not_found"),
        });

      const forumsQuery = await Forums.findOne({
        server: interaction.guild.id,
      });

      if (!forumsQuery) {
        const newForums = new Forums({
          server: interaction.guild.id,
          solvedText: title,
          allowedRole: role.id,
        });

        const savedForums = await newForums.save();

        if (!savedForums)
          return await interaction.reply({
            content: _("forum_not_registered"),
            ephemeral: true,
          });

        return await interaction.reply({
          content: _("forum_registered"),
          ephemeral: true,
        });
      }

      if (title) forumsQuery.solvedText = title;
      if (role) forumsQuery.allowedRole = role.id;

      const updatedForums = await forumsQuery.save();

      if (!updatedForums)
        return await interaction.reply({
          content: _("forum_not_updated"),
          ephemeral: true,
        });

      return await interaction.reply({
        content: _("forum_updated"),
        ephemeral: true,
      });
    } catch (error) {
      return await interaction.reply({
        content: _("an_unknown_error_occurred"),
      });
    }
  },
};
