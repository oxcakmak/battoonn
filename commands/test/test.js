const { SlashCommandBuilder } = require("discord.js");
const { _ } = require("../../utils/localization");
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const randomIdv4 = uuidv4();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription(_("command"))
    .addStringOption((option) =>
      option.setName("query").setDescription(_("search_word_or_link"))
    ),
  async execute(interaction) {
    if (interaction.bot) return;

    const canvas = createCanvas(450, 200);
    const ctx = canvas.getContext("2d");

    // Calculate the progress bar dimensions and position
    const avatarWidth = 200;
    const progressBarHeight = 200;
    const progressBarWidth = 50;
    const progressBarX = avatarWidth;
    const progressBarY = 0;

    // Load avatars
    const avatarLeft = await loadImage(
      "https://cdn.discordapp.com/avatars/1047662877538009149/32f91ca8ce8aa8f96f114432d9102375.jpg"
    );
    const avatarRight = await loadImage(
      "https://cdn.discordapp.com/avatars/1047662877538009149/32f91ca8ce8aa8f96f114432d9102375.jpg"
    );

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw progress bar background
    ctx.fillStyle = "#070708";
    ctx.fillRect(
      progressBarX,
      progressBarY,
      progressBarWidth,
      progressBarHeight
    );

    // Draw progress bar fill
    const progress = 6;
    const filledHeight = (progress / 100) * progressBarHeight;
    ctx.fillStyle = "#da366d";
    ctx.fillRect(
      progressBarX,
      progressBarY + progressBarHeight - filledHeight,
      progressBarWidth,
      filledHeight
    );

    // Draw progress text inside the green area
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 25px Arial";
    const progressText = `${progress}%`;
    ctx.fillText(
      progressText,
      progressBarX +
        (progressBarWidth - ctx.measureText(progressText).width) / 2,
      progressBarY + progressBarHeight - filledHeight + (progress < 25 ? 0 : 20) // Adjust Y position as needed
    );

    // Draw percentages
    const percentages = [75, 50, 25];
    percentages.forEach((percent) => {
      if (progress > percent) return;

      ctx.fillStyle = "#5e5e5f";
      ctx.font = percent <= progress ? "bold 12px Arial" : "normal 12px Arial"; // Bold for active, normal for remainder
      const text = `${percent}`;
      ctx.fillText(
        text,
        progressBarX + (progressBarWidth - ctx.measureText(text).width) / 2,
        progressBarY + progressBarHeight - (percent / 100) * progressBarHeight
      );
    });

    // Draw avatars
    ctx.drawImage(avatarLeft, 0, progressBarY, avatarWidth, canvas.height);
    ctx.drawImage(
      avatarRight,
      canvas.width - avatarWidth,
      progressBarY,
      avatarWidth,
      canvas.height
    );

    const relationshipFileName = `relationship-${interaction.user.id}-${randomIdv4}.jpg`;
    const relationshipFilePath = `temporary/relationship/${relationshipFileName}`;

    await fs.writeFileSync(
      relationshipFilePath,
      await canvas.toBuffer("image/jpeg")
    );

    await interaction.reply({
      type: 4,
      embeds: [
        {
          author: {
            name: "asdasdsad",
          },
          image: {
            url: `attachment://${relationshipFilePath}`,
          },
        },
      ],
      files: [relationshipFilePath],
      ephemeral: true,
    });

    // Delete generated QR code file after sending
    await fs.unlinkSync(relationshipFilePath);
  },
};
