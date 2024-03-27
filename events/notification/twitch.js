const TwitchApi = require("node-twitch").default;
const schedule = require("node-schedule");

// Replace with your Twitch Client ID and desired channel name
const clientId = "424284ai68cd2w2p8hnjs4rnsened8";
const clientSecret = "fsduplan40pam8nsjlhm6po91and04";
const channelName = "osmaninalemi";

const twitch = new TwitchApi({
  client_id: clientId,
  client_secret: clientSecret,
});

//get time local
const time = new Date().toLocaleString("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

// Flag to track if message has been sent
let messageSent = false;

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    const channelData = await twitch.getStreams({
      channel: channelName,
    });
    const stream = channelData.data[0];
    const userId = stream.id;
    const username = stream.user_login;
    const userTitle = stream.user_name;
    const category = stream.category;
    const type = stream.type;
    const title = stream.title;
    const thumbnail = stream.thumbnail_url
      .replace("{width}", 640)
      .replace("{height}", 360);
    const tags = stream.tags;
    // Schedule check every 5 minutes (adjust as needed)
    const job = await schedule.scheduleJob("* * * * *", async () => {
      const userData = await twitch.getUsers({
        user: userId,
      });
      const user = userData.data[0];
      console.log(stream);
      if (!messageSent) {
        messageSent = true;
      }
    });
  },
};
