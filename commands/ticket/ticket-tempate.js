const {
  PermissionsBitField,
  SlashCommandBuilder,
  ChannelType,
} = require("discord.js");
const { Configs, TicketConfigs } = require("../../database/schemas");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket-template")
    .setDescription(_("ticket_description_full"))
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription(_("ticket_template_channel"))
        .addChannelTypes(ChannelType.GuildText)
    )
    .addStringOption((option) =>
      option.setName("title").setDescription(_("ticket_template_title"))
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription(_("ticket_template_description"))
    )
    .addStringOption((option) =>
      option
        .setName("button")
        .setDescription(_("ticket_template_button_text_example"))
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

    if (interaction.options.data.length === 0)
      return await interaction.reply({
        content: _("enter_an_option"),
        ephemeral: true,
      });

    const serverId = interaction.guild.id;

    const channel = interaction.options.getChannel("channel");
    const title = interaction.options.getString("title");
    const description = interaction.options.getString("description");
    const button = interaction.options.getString("button");

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
        templateChannel: channel.id,
        templateTitle: title,
        templateDescription: description,
        templateButtonText: button,
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

    if (channel) ticketConfigsQuery.templateChannel = channel.id;
    if (title) ticketConfigsQuery.templateTitle = title;
    if (description) ticketConfigsQuery.templateDescription = description;
    if (button) ticketConfigsQuery.templateButtonText = button;

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
