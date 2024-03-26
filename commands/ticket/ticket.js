const {
  PermissionsBitField,
  SlashCommandBuilder,
  ChannelType,
} = require("discord.js");
const { Configs, TicketConfigs } = require("../../database/schemas");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription(_("ticket_description_full"))
    .addStringOption((option) =>
      option
        .setName("module")
        .setDescription(_("ticket_module"))
        .addChoices(
          { name: _("enable"), value: "true" },
          { name: _("disable"), value: "false" }
        )
    )
    .addChannelOption((option) =>
      option
        .setName("category")
        .setDescription(_("ticket_category_open_text"))
        .addChannelTypes(ChannelType.GuildCategory)
    )
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
    )
    .addRoleOption((option) =>
      option.setName("role").setDescription(_("ticket_role_description"))
    ),
  async execute(interaction) {
    if (interaction.bot) return;

    // Command description
    if (interaction.options.data.length === 0)
      return await interaction.reply({
        embeds: [
          {
            type: "rich",
            title: _("ticket_command"),
            description: _("ticket_description_full"),
            color: 0xffffff,
            fields: [
              {
                name: _("use_of"),
                value: `**module (enable/disable)**: ${_(
                  "ticket_module"
                )} \n **category**: ${_(
                  "ticket_category_open_text"
                )} \n **channel**: ${_(
                  "ticket_template_channel"
                )} \n **title**: ${_(
                  "ticket_template_title"
                )} \n **description**: ${_(
                  "ticket_template_description"
                )} \n **button**: ${_(
                  "ticket_template_button_text_example"
                )} \n **role**: ${_("ticket_role_description")}`,
              },
              {
                name: _("example"),
                value: `**/ticket module [enable/disable]** \n **/ticket TICKET** \n **/ticket #create-ticket** \n **/ticket Create ticket** \n **/ticket Click the button below to create a ticket** \n **/ticket Create a Ticket** \n **/ticket Ticketing**`,
              },
            ],
          },
        ],
      });

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

    const moduleEnabled = interaction.options.getString("module") || false;
    const category = interaction.options.getChannel("category");
    const channel = interaction.options.getChannel("channel");
    const title = interaction.options.getString("title");
    const description = interaction.options.getString("description");
    const button = interaction.options.getString("button");
    const role = interaction.options.getRole("role");

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
        moduleEnabled: moduleEnabled,
        category: category,
        templateChannel: channel,
        templateTitle: title,
        templateDescription: description,
        templateButtonText: button,
        role: role,
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

    if (!moduleEnabled && !ticketConfigsQuery.moduleEnabled)
      return await interaction.reply({
        content: _("activate_module_first"),
        ephemeral: true,
      });

    if (moduleEnabled) ticketConfigsQuery.moduleEnabled = moduleEnabled;
    if (category) ticketConfigsQuery.category = category.id;
    if (channel) ticketConfigsQuery.templateChannel = channel.id;
    if (title) ticketConfigsQuery.templateTitle = title;
    if (description) ticketConfigsQuery.templateDescription = description;
    if (button) ticketConfigsQuery.templateButtonText = button;
    if (role) ticketConfigsQuery.role = role.id;

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
