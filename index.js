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
  ],
  partials: [User, Message, GuildMember, ThreadMember],
});

client.commands = new Collection();

// Set up sharding
const shard = new ShardingManager("./index.js", { total: "auto" });

// Listen for shard ready event
shard.on("shardCreate", (shard) => {
  console.log(`Shard ${shard.id} is ready!`);
});

//login
client.login(token).then(async () => {
  loadEvents(client);
  loadCommands(client);
  loadDatabase();
  loadUtils();
});
