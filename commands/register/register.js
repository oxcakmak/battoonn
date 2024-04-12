const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const {
  Configs,
  Explorers,
  MusicConfigs,
  TicketConfigs,
} = require("../../database/schemas");
const { _ } = require("../../utils/localization");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("register")
    .setDescription(_("register_server")),
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
    let messageContent;
    try {
      const [server, explorer, musicConfig, ticketConfig] = await Promise.all([
        Configs.findOne({ server: serverId }),
        Explorers.findOne({ server: serverId }),
        MusicConfigs.findOne({ server: serverId }),
        TicketConfigs.findOne({ server: serverId }),
      ]);

      const existingSchemas = [];
      const notExistingSchemas = [];
      const notSavedSchemas = [];

      if (server) existingSchemas.push(_("configs"));
      if (explorer) existingSchemas.push(_("explorer"));
      if (musicConfig) existingSchemas.push(_("music"));
      if (ticketConfig) existingSchemas.push(_("ticket"));

      if (existingSchemas.length > 0) {
        const existingSchemaList = existingSchemas.join(", ");
        // console.log(`Schemas already exist: ${existingSchemaList}`);
        // You can send a response (e.g., using Express) here
        messageContent = _("schema_with_variable_exists", {
          schema: existingSchemaList,
        });
      } else {
        // Perform registration logic here, assuming schemas don't exist
        // console.log("No existing schemas found. Registering...");

        const newConfig = new Configs({
          server: serverId,
        });

        const saveConfig = await newConfig.save();

        const newExplorer = new Explorers({
          server: serverId,
        });

        const saveExplorer = await newExplorer.save();

        const newMusicConfig = new MusicConfigs({
          server: serverId,
        });

        const saveMusicConfig = await newMusicConfig.save();

        const newTicketConfigs = new TicketConfigs({
          server: serverId,
        });

        const saveTicketConfigs = await newTicketConfigs.save();

        if (!saveConfig) notSavedSchemas.push(_("configs"));
        if (!saveExplorer) notSavedSchemas.push(_("explorer"));
        if (!saveMusicConfig) notSavedSchemas.push(_("music"));
        if (!saveTicketConfigs) notSavedSchemas.push(_("ticket"));

        notExistingSchemas.push(_("configs"));
        notExistingSchemas.push(_("explorer"));
        notExistingSchemas.push(_("music"));
        notExistingSchemas.push(_("ticket"));

        const notExistingSchemaList = notExistingSchemas.join(", ");

        messageContent = _("schema_with_variable_registered", {
          schema: notExistingSchemaList,
        });
      }
    } catch (error) {
      console.error("Error during registration:", error);
      // Handle errors appropriately (e.g., send an error response)
      const notSavedSchemasList = notSavedSchemas.join(", ");
      messageContent = _("schema_with_variable_not_registered", {
        schema: notSavedSchemasList,
      });
    }

    return await interaction.reply({
      content: messageContent,
    });
  },
};
