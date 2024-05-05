const {
  ChannelType,
  EmbedBuilder,
  ReactionCollector,
  PermissionsBitField,
  SlashCommandBuilder,
} = require("discord.js");
const { Giveaways } = require("../../database/schemas");
const { _ } = require("../../utils/localization");
const { removeItemOnce } = require("../../utils/arrayFunctions");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("giveaway-blacklist")
    .setDescription(
      "Prevents the user or role from participating in the giveaway"
    )
    .addStringOption((option) =>
      option.setName("code").setDescription("Giveaway code").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("mention")
        .setDescription("Role or user to be banned from the giveaway")
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
    const mention = interaction.options.getString("mention");

    let targetId;

    const giveaway = await Giveaways.findOne({
      server: serverId,
      code: code,
    });

    if (!giveaway)
      return await interaction.reply({
        content: "Giveaway not found!",
        ephemeral: true,
      });

    // Extract role ID from mention
    if (mention.startsWith("<@&") && mention.endsWith(">")) {
      targetId = "r" + mention.slice(3, -1);

      // Extract user ID from mention
    } else if (mention.startsWith("<@") && mention.endsWith(">")) {
      targetId = "u" + mention.slice(2, -1);
    } else {
      return await interaction.reply({
        content: "Invalid mention format. Please mention a role or a user.",
        ephemeral: true,
      });
    }

    let message;
    if (!giveaway.blacklist.includes(targetId)) {
      giveaway.blacklist.push(targetId);
      message = "User added blacklist";
    } else {
      giveaway.blacklist = removeItemOnce(giveaway.blacklist, targetId);
      message = "User removed in blacklist";
    }

    await giveaway.save();

    return await interaction.reply({
      content: message,
      ephemeral: true,
    });
  },
};
