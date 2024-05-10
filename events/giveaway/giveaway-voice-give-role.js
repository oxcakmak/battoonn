// const member = await interaction.guild.members.cache.get(participantId);
const { Giveaways } = require("../../database/schemas");
const { _ } = require("../../utils/localization");
const { shuffleArray } = require("../../utils/arrayFunctions");
const { formattedCurrentDateTime } = require("../../utils/dateFunctions");

module.exports = {
  name: "voiceStateUpdate",
  once: true,
  async execute(client) {},
};
