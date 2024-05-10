// const member = await interaction.guild.members.cache.get(participantId);
const { VoiceState } = require("discord.js");
const { Giveaways } = require("../../database/schemas");
const { _ } = require("../../utils/localization");
const { shuffleArray } = require("../../utils/arrayFunctions");
const { formattedCurrentDateTime } = require("../../utils/dateFunctions");

module.exports = {
  name: "voiceStateUpdate",
  once: true,
  async execute(oldState, newState) {
    const { member } = newState;
    const channel = member.guild.channels.get(member.channel.id);

    const voiceStateUpdateEvent = {
      guildID: member.guild.id,
      eventName: "voiceStateUpdate",
      embeds: [
        {
          author: {
            name: `${member.username}#${member.discriminator} ${
              member.nick ? `(${member.nick})` : ""
            }`,
            icon_url: member.avatarURL,
          },
          description: `**${member.username}#${member.discriminator}** ${
            member.nick ? `(${member.nick})` : ""
          } had their voice state updated.`,
          fields: [
            {
              name: "Voice Channel",
              value: `<#${channel.id}> (${channel.name})`,
            },
            {
              name: "ID",
              value: `\`\`\`ini\nUser = ${member.id}\nChannel = ${channel.id}\n`,
            },
          ],
          color: 3553599,
        },
      ],
    };
    // if (member.guild.voiceStates.size < 20) {

    const user = log.user;
    const actionName = Object.keys(log.before)[0];
    if (!actionName) return;
    voiceStateUpdateEvent.embeds[0].fields.unshift({
      name: "Action",
      value:
        `${log.before[actionName] ? "un" : "now "}${actionName}` || "Unknown",
    });
    if (user && user.id && user.username) {
      voiceStateUpdateEvent.embeds[0].fields[
        voiceStateUpdateEvent.embeds[0].fields.length - 1
      ].value += `Perpetrator = ${user.id}\`\`\``;
      voiceStateUpdateEvent.embeds[0].footer = {
        text: `${user.username}#${user.discriminator}`,
        icon_url: user.avatarURL,
      };
    }
    await send(voiceStateUpdateEvent);
  },
};
