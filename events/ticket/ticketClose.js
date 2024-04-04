const fs = require("fs");
const { _ } = require("../../utils/localization");
const { Tickets, TicketConfigs } = require("../../database/schemas");
const { containsMultipleData } = require("../../utils/arrayFunctions");

const { v4: uuidv4 } = require("uuid");
const randomIdv4 = uuidv4();

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    const { customId, guild, message, channel } = await interaction;

    const serverId = guild.id;

    if (interaction.isButton() && customId === "btnCloseTicket") {
      const channelId = message.channelId;

      const TicketConfigsQuery = await TicketConfigs.findOne({
        server: serverId,
      });
      if (!TicketConfigsQuery)
        return await interaction.reply({
          content: _("ticket_configuration_not_found"),
          ephemeral: true,
        });

      const roleIds = interaction.member.roles.cache.map((role) => role.id);

      if (!containsMultipleData(roleIds, [TicketConfigsQuery.role]))
        return await interaction.reply({
          content: _("you_do_not_have_permission_command"),
          ephemeral: true,
        });

      // Check for specific role ID
      const ticketRole = interaction.member.roles.cache.has(
        TicketConfigsQuery.role
      );

      if (!ticketRole)
        return await interaction.reply({
          content: _("you_do_not_have_permission_command"),
          ephemeral: true,
        });

      let transcriptFile;
      transcriptFile = await fs.readFileSync(
        "./assets/transcript.html",
        "utf-8"
      );

      // Replace variables in transcript file
      transcriptFile = transcriptFile
        .replace("{{langTicketNumber}}", _("ticket_number"))
        .replace("{{langCreatedBy}}", _("created_by_user"))
        .replace("{{langCreationDate}}", _("creation_date"));

      // Get ticket
      const ticket = await Tickets.findOne({
        server: serverId,
        ticketId: channelId,
        isPost: false,
      });

      transcriptFile = transcriptFile
        .replace("{{ticket}}", ticket.ticket)
        .replace("{{ticketName}}", ticket.ticket)
        .replace("{{number}}", ticket.ticket.split("-")[1]);

      // Find ticket messages
      const ticketConversations = await Tickets.find({
        server: serverId,
        ticketId: channelId,
        isPost: true,
      }).sort({ id: 1 });

      const ticketOwner = await interaction.client.users.fetch(
        ticket.createdBy
      );

      transcriptFile = transcriptFile
        .replace("{{displayName}}", ticketOwner.globalName)
        .replace("{{username}}", ticketOwner.username)
        .replace("{{userId}}", ticketOwner.id)
        .replace("{{createAt}}", ticket.createdAt);

      async function fetchUser(user) {
        return await interaction.client.users.fetch(user);
      }

      let conversationsHtml = "";
      let conversationsUsers = [];

      (async () => {
        for (const data of ticketConversations) {
          const sender = await fetchUser(data.createdBy);
          conversationsUsers.push(data.createdBy);
          conversationsHtml += `<div class="message-content mb5">
            <div class="message-user"><span style="font-weight:bold;color: #d0d0d0;">${sender.globalName}</span>&nbsp;<small style="font-size:10px;color:#999;">${data.createdAt}</small></div>
            <div class="message-text" style="color: #efefef;">${data.content}</div>
          </div>`;
        }

        transcriptFile = transcriptFile.replace(
          "{{conversations}}",
          conversationsHtml
        );

        // To delete repeated items in an array
        conversationsUsers = [...new Set(conversationsUsers)];

        const transcriptTempFileName = `ticket-${randomIdv4}.html`;
        const transcriptTempFilePath = `transcript/${transcriptTempFileName}`;

        await fs.writeFileSync(transcriptTempFilePath, transcriptFile);

        async function sendDM(userId) {
          const user = await interaction.client.users.fetch(userId);
          try {
            await user.send({ type: 4, files: [transcriptTempFilePath] });
          } catch (error) {
            // console.error("Error sending DM:", error);
            // Handle the error gracefully
            // Here, you can choose to:
            // - Inform the user that the DM couldn't be sent (e.g., with interaction.reply)
            // - Log the error for debugging
            // - Continue execution without affecting other functionalities
          }
        }

        // Send transcripts to users direct message
        for (const userId of conversationsUsers) {
          await sendDM(userId);
        }

        // Delete transcripts send users after
        await fs.unlinkSync(transcriptTempFilePath);

        // Delete ticket from database
        const deletedTicket = await Tickets.deleteMany({
          server: serverId,
          ticketId: channelId,
        });

        if (deletedTicket) await channel.delete();
      })();
    }
  },
};
