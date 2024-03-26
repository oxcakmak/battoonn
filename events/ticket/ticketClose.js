const fs = require("fs");
const { MessageAttachment, PermissionsBitField } = require("discord.js");
const { _ } = require("../../utils/localization");
const { Tickets, TicketConfigs } = require("../../database/schemas");

const { v4: uuidv4 } = require("uuid");
const randomIdv4 = uuidv4();

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    const { customId, guild, user, message } = await interaction;

    const serverId = guild.id;

    let conversationsHtml;
    let conversationsUsers = [];

    if (interaction.isButton() && customId === "btnCloseTicket") {
      const channelId = message.channelId;
      const member = await message.guild.members.fetch(user.id); // Fetch member object

      const { role } = await TicketConfigs.findOne({ server: serverId });
      if (role) {
        const ticketRole = member.roles.cache.has(role); // Check for specific role ID

        let transcriptFile;
        transcriptFile = await fs.readFileSync(
          "./assets/transcript.html",
          "utf-8"
        );

        if (
          !ticketRole ||
          !interaction.member.permissions.has(
            PermissionsBitField.Flags.Administrator
          )
        )
          return await interaction.reply({
            content: _("you_do_not_have_permission_command"),
            ephemeral: true,
          });

        // Get ticket
        const ticket = await Tickets.findOne({
          server: serverId,
          ticketId: channelId,
          isPost: false,
        });

        // Find ticket messages
        const ticketConversations = await Tickets.find({
          server: serverId,
          ticketId: channelId,
          isPost: true,
        }).sort({ id: 1 });

        const ticketOwner = await interaction.client.users.fetch(
          ticket.createdBy
        );

        async function fetchUser(user) {
          return await interaction.client.users.fetch(user);
        }

        (async () => {
          for (const data of ticketConversations) {
            const sender = await fetchUser(data.createdBy);
            conversationsUsers.push(data.createdBy);
            conversationsHtml += `<div class="message-content">
            <div class="message-user"><span style="font-weight:bold;color: #d0d0d0;">{{${sender.globalName}}}</span>&nbsp;<small style="font-size:10px;color:#999;">${data.createdAt}</small></div>
            <div class="message-text" style="color: #efefef;">${data.content}</div>
          </div>`;
          }
        })();

        // To delete repeated items in an array
        conversationsUsers = [...new Set(conversationsUsers)];

        // Replace variables in transcript file
        transcriptFile = transcriptFile
          .replace("{{ticket}}", ticket.ticket)
          .replace("{{ticketName}}", ticket.ticket)
          .replace("{{langTicketNumber}}", _("ticket_number"))
          .replace("{{langCreatedBy}}", _("created_by_user"))
          .replace("{{langCreationDate}}", _("creation_date"))
          .replace("{{number}}", ticket.ticket.split("-")[1])
          .replace("{{displayName}}", ticketOwner.globalName)
          .replace("{{username}}", ticketOwner.username)
          .replace("{{userId}}", ticketOwner.id)
          .replace("{{createAt}}", ticket.createdAt)
          .replace("{{conversations}}", conversationsHtml);

        const transcriptTempFileName = `ticket-${randomIdv4}.html`;
        const transcriptTempFilePath = `transcript/${transcriptTempFileName}`;

        await fs.writeFileSync(transcriptTempFilePath, transcriptFile);

        async function sendDM(userId) {
          try {
            const user = await interaction.client.users.fetch(userId);
            await user.send({ type: 4, files: [transcriptTempFilePath] });
            console.log(`Sent DM to user: ${user.username}`);
          } catch (error) {
            console.error(`Failed to send DM to user ${userId}:`, error);
          }
        }

        (async () => {
          for (const userId of conversationsUsers) {
            await sendDM(userId, transcriptTempFileName);
          }
          await fs.unlinkSync(transcriptTempFilePath);
        })();
      }
    }
  },
};
