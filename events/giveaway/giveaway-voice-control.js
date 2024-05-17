const { Giveaways } = require("../../database/schemas");
const { _ } = require("../../utils/localization");
const { removeItemOnce } = require("../../utils/arrayFunctions");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    // Listen for the voiceStateUpdate event
    client.on("voiceStateUpdate", async (oldState, newState) => {
      const { member, guild } = newState;

      // Get the channels the member joined and left
      const joinedChannel = newState.channel;
      const leftChannel = oldState.channel;

      // Handle member leaving a voice channel
      if (!joinedChannel) {
        console.log(
          `${member.user.tag} left the voice channel: ${leftChannel.name}`
        );
        const serverUser = await guild.members.cache.get(member.id);

        const voiceGiveaway = await Giveaways.findOne({
          server: guild.id,
          voiceId: leftChannel.id,
          ended: false,
        });

        if (
          voiceGiveaway &&
          voiceGiveaway.voiceRole &&
          voiceGiveaway.participants.includes("u" + member.id) &&
          serverUser.roles.cache.has(voiceGiveaway.voiceRole)
        ) {
          // Handle member joining a voice channel
          if (joinedChannel && !leftChannel) {
            console.log(
              `${member.user.tag} joined the voice channel: ${joinedChannel.name}`
            );
            const serverUser = await guild.members.cache.get(member.id);

            const voiceGiveaway = await Giveaways.findOne({
              server: guild.id,
              voiceId: joinedChannel.id,
              ended: false,
            });

            if (
              voiceGiveaway &&
              voiceGiveaway.voiceRole &&
              voiceGiveaway.participants.includes("u" + member.id) &&
              !serverUser.roles.cache.has(voiceGiveaway.voiceRole)
            ) {
              try {
                await serverUser.roles.add(voiceGiveaway.voiceRole);
              } catch (error) {
                console.log("Error: ", error);
              }
            }
          }

          /*
          // Handle member switching voice channels
          if (joinedChannel && leftChannel && joinedChannel !== leftChannel) {
            console.log(
              `${member.user.tag} switched voice channels from ${leftChannel.name} to ${joinedChannel.name}`
            );
          }
          */
          try {
            voiceGiveaway.participants = removeItemOnce(
              voiceGiveaway.participants,
              "u" + member.id
            );

            await voiceGiveaway.save();

            await serverUser.roles.remove(voiceGiveaway.voiceRole);
          } catch (error) {
            console.log("Error: ", error);
          }
        }
      }
    });
  },
};
