const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("user-rename")
    .setDescription(_("adds_tags_the_beginning_end_of_username"))
    .addStringOption((option) =>
      option
        .setName("position")
        .setDescription(_("where_to_add_tags"))
        .addChoices(
          { name: _("beginning_of_username"), value: "prepend" },
          { name: _("end_of_username"), value: "append" }
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("tag")
        .setDescription(_("what_tag_should_you_add"))
        .setRequired(true)
        .setMaxLength(25)
    )
    .addUserOption((option) =>
      option.setName("user").setDescription(_("which_user")).setRequired(true)
    ),
  async execute(interaction) {
    if (interaction.bot) return;

    const { member } = interaction;

    if (
      !member.permissions.has(PermissionsBitField.Flags.Administrator) ||
      !member.permissions.has(PermissionsBitField.Flags.ManageNicknames)
    )
      return await interaction.reply({
        content: _("you_do_not_have_permission_command"),
        ephemeral: true,
      });

    const position = interaction.options.getString("position");
    const tag = interaction.options.getString("tag");
    const user = interaction.options.getUser("user");
    const target = interaction.guild.members.cache.get(user.id);

    try {
      const currentDisplayName = target.displayName;
      let newDisplayName = currentDisplayName;

      switch (position) {
        case "prepend":
          newDisplayName = tag + currentDisplayName;
          break;
        case "append":
          newDisplayName += tag;
          break;
        default:
          newDisplayName = currentDisplayName;
          break;
      }

      await target.setNickname(newDisplayName);
      return await interaction.reply({
        content: _("username_has_been_changed"),
        ephemeral: true,
      });
    } catch (error) {
      // console.error("Error modifying nickname:", error);
      // Consider sending a message to the user or logging the error for debugging
      return await interaction.reply({
        content: _("username_could_not_be_changed"),
        ephemeral: true,
      });
    }
  },
};
