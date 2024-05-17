const { _ } = require("../../utils/localization");
const { formattedCurrentDateTime } = require("../../utils/dateFunctions");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    // console.log(`${formattedCurrentDateTime()} | ${client.user.username} is now online.`);
  },
};
