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
    const { customId } = await interaction;
    if (interaction.isButton()) {
      if (customId === "btnCreateTicket") {
        return await interaction.reply({
          embeds: [
            {
              description: `**Oluşturan Kullanıcı**:\n<@${interaction.user.id}> (${interaction.user.id})\n\n**Oluşturulma Tarihi**:\n**${time}**\n\n**Yetkili**:\n<@&1216897081348722789>`,
              color: 0xffffff,
            },
          ],
          ephemeral: true,
        });
      }
    }
  },
};
