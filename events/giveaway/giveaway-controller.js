const schedule = require("node-schedule");
const { Giveaways } = require("../../database/schemas");
const { _ } = require("../../utils/localization");
const { shuffleArray } = require("../../utils/arrayFunctions");
const { formattedCurrentDateTime } = require("../../utils/dateFunctions");

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
          try {
            await serverUser.roles.remove(voiceGiveaway.voiceRole);
          } catch (error) {
            console.log("Error: ", error);
          }
        }
      }

      // Handle member joining a voice channel
      if (joinedChannel) {
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

    // Cron
    await schedule.scheduleJob("* * * * *", async () => {
      const GiveawaysQuery = await Giveaways.find({
        endAt: formattedCurrentDateTime(),
        ended: false,
      });
      GiveawaysQuery.forEach(async (Giveaway) => {
        let tempReserves = 0;
        // If reservesCount exceeds the remaining participants, adjust reservesCount
        if (Giveaway.reserves > Giveaway.participants - Giveaway.winners)
          tempReserves = Giveaway.participants - Giveaway.winners;

        await shuffleArray(Giveaway.participants);

        // Pick winners
        for (let i = 0; i < Giveaway.winners; i++) {
          Giveaway.winnersList.push(
            `<@${Giveaway.participants[i].replace("u", "")}>`
          );
        }

        // Pick reserves
        if (Giveaway.reserves > 0) {
          for (
            let i = tempReserves;
            i < Giveaway.winners + Giveaway.reserves;
            i++
          ) {
            Giveaway.reservesList.push(
              `<@${Giveaway.participants[i].replace("u", "")}>`
            );
          }
        }

        const messageChannel = await client.guilds.cache
          .get(Giveaway.server)
          ?.channels.cache.get(Giveaway.channelId);

        const fetchedMessage = await messageChannel.messages.fetch(
          Giveaway.messageId
        );
        if (!messageChannel || !fetchedMessage) return;

        Giveaway.ended = true;

        await Giveaway.save();

        const winnerObject = {
          name: "Winners",
          value: Giveaway.winnersList
            .map((item, index) => `${index + 1}. ${item}`)
            .join("\n"),
        };

        const reserveObject = {
          name: "Reserves",
          value:
            Giveaway.reservesList.length > 0
              ? Giveaway.reservesList
                  .map((item, index) => `${index + 1}. ${item}`)
                  .join("\n")
              : "",
        };

        const embed = {
          embeds: [
            {
              title: "Giveaway ended!",
              description: "Giveaway #" + Giveaway.code + " ended!",
              fields:
                Giveaway.reservesList.length > 0
                  ? [winnerObject, reserveObject]
                  : [winnerObject],
            },
          ],
          components: [],
        };

        try {
          await fetchedMessage.edit(embed);
        } catch (e) {
          console.log(e.message);
        }
      });
    });
  },
};
