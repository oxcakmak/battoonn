const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
  ShardingManager,
} = require("discord.js");

const {
  Guilds,
  GuildMembers,
  GuildMessages,
  GuildMessageReactions,
  MessageContent,
  GuildVoiceStates,
  GuildEmojisAndStickers,
  GuildInvites,
} = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

//events and commands
const { loadEvents } = require("./handlers/eventHandler");
const { loadCommands } = require("./handlers/commandHandler");
const { loadDatabase } = require("./handlers/databaseHandler");
const { loadUtils } = require("./handlers/utilsHandler");

// get token
const { token } = require("./config.json");

const client = new Client({
  intents: [
    Guilds,
    GuildMembers,
    GuildMessages,
    GuildMessageReactions,
    MessageContent,
    GuildVoiceStates,
    GuildEmojisAndStickers,
    GuildInvites,
  ],
  partials: [User, Message, GuildMember, ThreadMember],
});

client.commands = new Collection();

// Set up sharding
const shard = new ShardingManager("./bot.js", { total: "auto" });

//login
client.login(token).then(async () => {
  loadEvents(client);
  loadCommands(client);
  loadDatabase();
  loadUtils();
});

// Listen for shard ready event
shard.on("shardCreate", (shard) => {
  console.log(`Shard ${shard.id} is ready!`);
});
