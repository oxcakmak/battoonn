const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const { Configs, TicketConfigs } = require("../../database/schemas");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket-create-template")
    .setDescription(_("ticket_create_template")),
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

    const serverId = interaction.guild.id;

    const checkRegisteredServer = await Configs.findOne({ server: serverId });
    const ticketConfigsQuery = await TicketConfigs.findOne({
      server: serverId,
    });

    if (!checkRegisteredServer)
      return await interaction.reply({
        content: _("register_the_server_first"),
      });

    if (!ticketConfigsQuery)
      return await interaction.reply({
        content: _("ticket_configuration_not_found"),
        ephemeral: true,
      });

    const {
      moduleEnabled,
      templateChannel,
      templateTitle,
      templateDescription,
      templateButtonText,
    } = ticketConfigsQuery;

    if (ticketConfigsQuery && !moduleEnabled)
      return await interaction.reply({
        content: _("activate_module_first"),
        ephemeral: true,
      });

    if (
      !templateChannel ||
      !templateTitle ||
      !templateDescription ||
      !templateButtonText
    )
      return await interaction.reply({
        content: _("all_fields_must_be_filled"),
        ephemeral: true,
      });

    try {
      const templateTextChannel = await interaction.guild.channels.fetch(
        templateChannel
      );

      if (!templateTextChannel)
        return await interaction.reply({
          content: _("channel_not_found"),
          ephemeral: true,
        });

      const sendTemplate = await templateTextChannel.send({
        components: [
          {
            type: 1,
            components: [
              {
                style: 3,
                label: templateButtonText,
                custom_id: `btnCreateTicket`,
                disabled: false,
                type: 2,
              },
            ],
          },
        ],
        embeds: [
          {
            type: "rich",
            title: templateTitle,
            description: templateDescription,
          },
        ],
      });

      if (!sendTemplate)
        return await interaction.reply({
          content: _("template_message_not_sent"),
          ephemeral: true,
        });

      return await interaction.reply({
        content: _("template_message_sent"),
      });
    } catch (error) {
      console.error("Error fetching channel information:", error);
    }
  },
};
