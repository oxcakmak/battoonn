const { PermissionsBitField } = require("discord.js");
const { _ } = require("../../utils/localization");
const { Tickets, TicketConfigs } = require("../../database/schemas");

const time = new Date().toLocaleString("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    const { customId, guild, user } = await interaction;

    const serverId = guild.id;

    if (interaction.isButton() && customId === "btnCreateTicket") {
      if (
        !guild.members.me.permissions.has(
          PermissionsBitField.Flags.ManageChannels
        )
      )
        return await interaction.reply({
          content: _("you_do_not_have_permission_command"),
          ephemeral: true,
        });

      const TicketConfigsQuery = await TicketConfigs.findOne({
        server: serverId,
      });

      if (TicketConfigsQuery) {
        const { category, moduleEnabled, role } = TicketConfigsQuery;

        if (!moduleEnabled)
          return await interaction.reply({
            content: _("activate_module_first"),
            ephemeral: true,
          });

        const ticketCategory = guild.channels.cache.get(category)?.guild;

        if (!category || !ticketCategory)
          return await interaction.reply({
            content: _("ticket_category_not_found"),
            ephemeral: true,
          });

        if (!role)
          return await interaction.reply({
            content: _("ticket_role_not_selected"),
            ephemeral: true,
          });

        const TicketsQuery = await Tickets({
          server: serverId,
        });

        const { createdBy } = TicketsQuery;

        if (createdBy)
          return await interaction.reply({
            content: _("you_have_an_active_ticket"),
            ephemeral: true,
          });

        const documentCount = await Tickets.countDocuments({
          server: serverId,
          isPost: false,
        });

        const ticketTitle = "ticket-" + (documentCount + 1);

        await guild.channels
          .create({
            type: 0,
            name: ticketTitle,
            parent: category,
            permissionOverwrites: [
              {
                id: guild.roles.everyone, // Everyone
                deny: [PermissionsBitField.Flags.ViewChannel],
              },
              {
                id: user.id, // Interaction user (allow view)
                allow: [PermissionsBitField.Flags.ViewChannel],
              },
              {
                id: role, // Custom role (allow view)
                allow: [PermissionsBitField.Flags.ViewChannel],
              },
            ],
          })
          .then(async (channel) => {
            const createTickets = await new Tickets({
              server: serverId,
              ticketId: channel.id,
              ticket: ticketTitle,
              content: null,
              isPost: false,
              createdBy: user.id,
              createdAt: time,
            });

            createTickets.save();

            if (!createTickets)
              return await interaction.reply({
                content: _("ticket_create_failed"),
                ephemeral: true,
              });

            await channel.send({
              embeds: [
                {
                  description: `**${_("created_by_user")}**:\n<@${user.id}> (${
                    user.id
                  })\n\n**${_("creation_date")}**:\n${time}\n\n**${_(
                    "authorized"
                  )}**:\n<@&${role}>`,
                  color: 0xffffff,
                },
              ],
              components: [
                {
                  type: 1,
                  components: [
                    {
                      style: 4,
                      label: _("close_ticket"),
                      custom_id: `btnCloseTicket`,
                      disabled: false,
                      type: 2,
                    },
                  ],
                },
              ],
            });
            await interaction.reply({
              content: _("ticket_create_with_mention", {
                title: `<#${channel.id}>`,
              }),
              ephemeral: true,
            });
          });
      }
    }
  },
};
