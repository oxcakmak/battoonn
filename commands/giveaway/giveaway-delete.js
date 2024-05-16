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

    try {
      if (giveaway.messageId) {
        const channel = await interaction.guild.channels.cache.get(
          giveaway.channelId
        );
        const message = await channel.messages.fetch(giveaway.messageId);
        await message.delete();
      }

      await Giveaways.deleteOne({
        server: serverId,
        code: code,
      });

      return await interaction.reply({
        content: "Deleted giveaway successfully",
        ephemeral: true,
      });
    } catch (error) {
      return await interaction.reply({
        content: "Can not delete giveaway",
        ephemeral: true,
      });
    }
  },
};
