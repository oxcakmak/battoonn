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
    .setDescription(_("register_module")),
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

    const serverId = await interaction.guild.id;

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

    if (existingSchemas.length === 0) existingSchemas.push("n/A");
    if (registeredSchemas.length === 0) registeredSchemas.push("n/A");

    const responseMessage = _("schema_with_variable_exists_and_registered", {
      exists: existingSchemas.join(", "),
      registered: registeredSchemas.join(", "),
    });
    await interaction.reply({ content: responseMessage, ephemeral: true });
  },
};
