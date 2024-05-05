const {
  ChannelType,
  EmbedBuilder,
  ReactionCollector,
  PermissionsBitField,
  SlashCommandBuilder,
} = require("discord.js");
const { Giveaways } = require("../../database/schemas");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("giveaway-delete")
    .setDescription(_("open_explorer_module"))
    .addStringOption((option) =>
      option
        .setName("code")
        .setDescription(_("filter_by_role"))
        .setRequired(true)
    ),
  async execute(interaction) {
    if (interaction.bot) return;

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

    const serverId = await interaction.guild.id;

    const code = interaction.options.getString("code");

    const giveaway = await Giveaways.findOne({
      server: serverId,
      code: code,
    });

    if (!giveaway)
      return await interaction.reply({
        content: "Giveaway not found",
        ephemeral: true,
      });

    const deleteGiveaway = Giveaways.deleteOne({
      server: serverId,
      code: code,
    });

    if (!deleteGiveaway)
      return await interaction.reply({
        content: "Can not delete giveaway",
        ephemeral: true,
      });

    return await interaction.reply({
      content: "Deleted giveaway successfully",
      ephemeral: true,
    });
  },
};
