const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const qr = require("qrcode");
const { v4: uuidv4 } = require("uuid");
const { _ } = require("../../utils/localization");

const randomIdv4 = uuidv4();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("qr")
    .setDescription(_("generates_qr_code"))
    .addStringOption((option) =>
      option
        .setName("data")
        .setDescription(_("qr_code_data"))
        .setMaxLength(50)
        .setRequired(true)
    ),
  async execute(interaction) {
    if (interaction.bot) return;

    if (interaction.options.data.length === 0)
      return await interaction.reply({
        embeds: [
          {
            type: "rich",
            title: _("qr_code"),
            description: _("generates_qr_code"),
            fields: [
              {
                name: _("commands"),
                value: "/qr-generate `battoonn bot`",
              },
            ],
          },
        ],
      });

    const data = interaction.options.getString("data");

    if (!data) return;

    // Generate QR code
    const qrFileName = `qr-${interaction.user.id}-${randomIdv4}.png`;
    const qrCodeFilePath = `qr/${qrFileName}`;

    const qrCodeOptions = {
      scale: 10, // Adjust the value for desired size (larger value = larger image)
    };

    await qr.toFile(qrCodeFilePath, data, qrCodeOptions);

    await interaction.reply({
      type: 4,
      files: [qrCodeFilePath],
    });

    // Delete generated QR code file after sending
    await fs.unlinkSync(qrCodeFilePath);
  },
};
