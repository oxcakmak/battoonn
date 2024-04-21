const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const {
  Configs,
  Explorers,
  TicketConfigs,
  InviteTrackerConfigs,
} = require("../../database/schemas");
const { _ } = require("../../utils/localization");

module.exports = {
  cooldowns: 5,
  data: new SlashCommandBuilder()
    .setName("register")
    .setDescription(_("register_module"))
    .addStringOption((option) =>
      option
        .setName("module")
        .setDescription(_("explorer_module_related_to_members"))
        .addChoices(
          { name: _("modules_all"), value: "all" },
          { name: _("module_server"), value: "server" },
          { name: _("module_explorer"), value: "explorer" },
          { name: _("ticket_module"), value: "ticket" },
          { name: _("module_invite_tracker"), value: "inviteTracker" }
        )
        .setRequired(true)
    ),
  async execute(interaction) {
    // Permission check with a descriptive error message
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await interaction.reply({
        content: _("you_do_not_have_permission_command"),
        ephemeral: true,
      });

    const module = interaction.options.getString("module");

    const serverId = interaction.guild.id;

    const existingSchemas = [];
    const registeredSchemas = [];

    // Retrieve existing configurations using Promise.all for efficiency
    const [server, explorer, ticket, inviteTracker] = await Promise.all([
      Configs.findOne({ server: serverId }),
      Explorers.findOne({ server: serverId }),
      TicketConfigs.findOne({ server: serverId }),
      InviteTrackerConfigs.findOne({ server: serverId }),
    ]);

    if (server) existingSchemas.push(_("configs"));
    if (explorer) existingSchemas.push(_("explorer"));
    if (ticket) existingSchemas.push(_("ticket"));
    if (inviteTracker) existingSchemas.push(_("invite_tracker"));

    let newConfig;
    let newExplorer;
    let newTickets;
    let newInviteTrackers;

    switch (module) {
      case "all":
        if (!server) {
          newConfig = await new Configs({ server: serverId });
          await newConfig.save();
          await registeredSchemas.push(_("configs"));
        }

        if (!explorer) {
          newExplorer = await new Explorers({ server: serverId });
          await newExplorer.save();
          await registeredSchemas.push(_("explorer"));
        }

        if (!ticket) {
          newTickets = await new TicketConfigs({ server: serverId });
          await newTickets.save();
          await registeredSchemas.push(_("ticket"));
        }

        if (!inviteTracker) {
          newInviteTrackers = await new InviteTrackerConfigs({
            server: serverId,
          });
          await newInviteTrackers.save();
          await registeredSchemas.push(_("invite_tracker"));
        }
        break;

      case "server":
        if (!server) {
          newConfig = await new Configs({ server: serverId });
          await newConfig.save();
          await registeredSchemas.push(_("configs"));
        }
        break;

      case "explorer":
        if (!explorer) {
          newExplorer = await new Explorers({ server: serverId });
          await newExplorer.save();
          await registeredSchemas.push(_("explorer"));
        }
        break;

      case "ticket":
        if (!ticket) {
          newTickets = await new TicketConfigs({ server: serverId });
          await newTickets.save();
          await registeredSchemas.push(_("ticket"));
        }
        break;

      case "inviteTracker":
        if (!inviteTracker) {
          newInviteTrackers = await new InviteTrackerConfigs({
            server: serverId,
          });
          await newInviteTrackers.save();
          await registeredSchemas.push(_("invite_tracker"));
        }
        break;
    }

    if (existingSchemas.length === 0) existingSchemas.push("n/A");
    if (registeredSchemas.length === 0) registeredSchemas.push("n/A");

    const responseMessage = _("schema_with_variable_exists_and_registered", {
      exists: existingSchemas.join(", "),
      registered: registeredSchemas.join(", "),
    });
    await interaction.reply({ content: responseMessage, ephemeral: true });
  },
};
