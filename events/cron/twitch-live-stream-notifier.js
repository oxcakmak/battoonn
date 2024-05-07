const TwitchApi = require("node-twitch").default;
const schedule = require("node-schedule");
const { _ } = require("../../utils/localization");
const { twitchApiClient, twitchApiSecret } = require("../../config.json");
const { formattedCurrentDateTime } = require("../../utils/dateFunctions");
// formattedCurrentDateTime()

// Replace with your Twitch Client ID and desired channel name
const channelName = "osmaninalemi";

const twitch = new TwitchApi({
  client_id: twitchApiClient,
  client_secret: twitchApiSecret,
});

// Flag to track if message has been sent
let messageSent = false;

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    /*
    const channelData = await twitch.getStreams({
      channel: channelName,
    });
    const stream = await channelData.data[0];
    const userId = stream.user_id;
    const username = stream.user_login;
    const userTitle = stream.user_name;
    const category = stream.category;
    const type = stream.type;
    const title = stream.title;
    const startedAt = stream.started_at;
    const thumbnail = stream.thumbnail_url
      .replace("{width}", 640)
      .replace("{height}", 360);
    const tags = stream.tags;
    const viewerCount = stream.viewer_count;
    const userData = await twitch.getUsers(userId);
    const user = await userData.data[0];
    const profileImage = user.profile_image_url;
    let humanizeTags;
    for (const tag of tags) {
      humanizeTags += "`" + tag + "`&nbsp;";
    }

    const embed = {
      embeds: [
        {
          type: "rich",
          title: _("username_is_on_live_stream", { username: userTitle }),
          description: "",
          color: 0xffffff,
          fields: [
            {
              name: _("stream_title"),
              value: title,
            },
            {
              name: _("category"),
              value: category,
              inline: true,
            },
            {
              name: _("viewer"),
              value: viewerCount,
              inline: true,
            },
            {
              name: _("tag_s"),
              value: humanizeTags,
            },
          ],
          timestamp: startedAt,
          image: {
            url: thumbnail,
            proxy_url: thumbnail,
            height: 640,
            width: 360,
          },
          thumbnail: {
            url: profileImage,
            height: 300,
            width: 300,
          },
          url: `https://twitch.tv/${username}`,
        },
      ],
    };

    // Schedule check every 5 minutes (adjust as needed)
    const job = await schedule.scheduleJob("* * * * *", async () => {
      if (!messageSent && type === "live") {
        messageSent = true;
      }
    });
    */
  },
};
