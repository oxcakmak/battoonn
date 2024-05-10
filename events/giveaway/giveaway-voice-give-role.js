// const member = await interaction.guild.members.cache.get(participantId);
const { createDiscordJSAdapter } = require("@discordjs/voice");
const { Giveaways } = require("../../database/schemas");
const { _ } = require("../../utils/localization");
const { shuffleArray } = require("../../utils/arrayFunctions");
const { formattedCurrentDateTime } = require("../../utils/dateFunctions");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    // Listen for the voiceStateUpdate event
    client.on("voiceStateUpdate", (oldState, newState) => {
      // Get the member object from the new voice state
      const { member, guild } = newState;

      // Get the channels the member joined and left
      const joinedChannel = newState.channel;
      const leftChannel = oldState.channel;

      // Handle member leaving a voice channel
      if (!joinedChannel) {
        console.log(
          `${member.user.tag} left the voice channel: ${leftChannel.name}`
        );
      }

      // Handle member joining a voice channel
      if (joinedChannel) {
        console.log(
          `${member.user.tag} joined the voice channel: ${joinedChannel.name}`
        );
      }

      // Handle member switching voice channels
      if (joinedChannel && leftChannel && joinedChannel !== leftChannel) {
        console.log(
          `${member.user.tag} switched voice channels from ${leftChannel.name} to ${joinedChannel.name}`
        );
      }

      // Check if the member started speaking
      if (!oldState.streaming && newState.streaming) {
        console.log(
          `${newState.member.user.tag} started speaking in channel ${newState.channel.name}`
        );
      }
      // Check if the member stopped speaking
      if (oldState.streaming && !newState.streaming) {
        console.log(
          `${newState.member.user.tag} stopped speaking in channel ${oldState.channel.name}`
        );
      }
    });
  },
};
