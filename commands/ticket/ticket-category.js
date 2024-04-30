const {
  PermissionsBitField,
  SlashCommandBuilder,
  ChannelType,
} = require("discord.js");
const { Configs, TicketConfigs } = require("../../database/schemas");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket-category")
    .setDescription(_("ticket_description_full"))
    .addChannelOption((option) =>
      option
        .setName("category")
        .setDescription(_("ticket_category_open_text"))
        .addChannelTypes(ChannelType.GuildCategory)
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

    const category = interaction.options.getChannel("category");

    const checkRegisteredServer = await Configs.findOne({ server: serverId });
    const ticketConfigsQuery = await TicketConfigs.findOne({
      server: serverId,
    });

    if (!checkRegisteredServer)
      return await interaction.reply({
        content: _("register_the_server_first"),
      });

    if (!ticketConfigsQuery) {
      const newTicketConfigs = new TicketConfigs({
        server: serverId,
        category: category,
      });

      const savedTicketConfigs = await newTicketConfigs.save();

      if (!savedTicketConfigs)
        return await interaction.reply({
          content: _("ticket_settings_not_saved"),
          ephemeral: true,
        });

      return await interaction.reply({
        content: _("ticket_settings_saved"),
        ephemeral: true,
      });
    }

    if (!ticketConfigsQuery.moduleEnabled)
      return await interaction.reply({
        content: _("activate_module_first"),
        ephemeral: true,
      });

    ticketConfigsQuery.category = category.id;

    const ticketConfigsUpdate = await ticketConfigsQuery.save();
    if (!ticketConfigsUpdate)
      return await interaction.reply({
        content: _("ticket_settings_not_updated"),
        ephemeral: true,
      });

    return await interaction.reply({
      content: _("ticket_settings_updated"),
    });
  },
};
