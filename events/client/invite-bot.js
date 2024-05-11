const {
  EmbedBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");

const { botName, botAvatar, botWebsite } = require("../../config.json");

module.exports = {
  name: "guildCreate",
  execute(guild) {
    const { members, channels } = guild;
    let channelToSend;
    //find channel can send first message
    channels.cache.forEach((channel) => {
      if (
        channel.type === 0 &&
        !channelToSend &&
        channel.permissionsFor(members.me).has("SendMessages")
      )
        channelToSend = channel;
    });
    if (!channelToSend) return;

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${botName}`,
        iconURL: `${botAvatar}`,
        url: `${botWebsite}`,
      })
      .setDescription(
        `Thanks for using me 🤍 Have a nice day \n /help | show all commands`
      );

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel(`Up vote`)
        .setStyle(ButtonStyle.Link)
        .setEmoji("🤍")
        .setURL(`${botWebsite}`)
    );
    channelToSend.send({ embeds: [embed], components: [row] });
  },
};
