const schedule = require("node-schedule");
const { Giveaways } = require("../../database/schemas");
const { _ } = require("../../utils/localization");
const { shuffleArray } = require("../../utils/arrayFunctions");
const { formattedCurrentDateTime } = require("../../utils/dateFunctions");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    setInterval(async () => {
      const GiveawaysQuery = await Giveaways.find({
        endAt: formattedCurrentDateTime(),
        ended: false,
      });
      GiveawaysQuery.forEach(async (Giveaway) => {
        console.log(Giveaway);
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
          value: Giveaway.reservesList
            .map((item, index) => `${index + 1}. ${item}`)
            .join("\n"),
        };

        const embed = {
          embeds: [
            {
              title: "Giveaway ended!",
              description: "Members who won giveaway #" + Giveaway.code,
              fields: [
                winnerObject,
                Giveaway.reservesList ? reserveObject : null,
              ],
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
    }, 15000);
    /*
    await schedule.scheduleJob("* * * * *", async () => {
      const GiveawaysQuery = await Giveaways.find({
        endAt: formattedCurrentDateTime(),
        ended: false,
      });
      GiveawaysQuery.forEach(async (Giveaway) => {
        console.log(Giveaway);
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
          value: Giveaway.reservesList
            .map((item, index) => `${index + 1}. ${item}`)
            .join("\n"),
        };

        const embed = {
          embeds: [
            {
              title: "Giveaway ended!",
              description: "Members who won giveaway #" + Giveaway.code,
              fields: [
                winnerObject,
                Giveaway.reservesList ? reserveObject : null,
              ],
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
    */
  },
};
