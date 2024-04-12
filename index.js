const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
} = require("discord.js");

const {
  Guilds,
  GuildMembers,
  GuildMessages,
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
    MessageContent,
    GuildVoiceStates,
  ],
  partials: [User, Message, GuildMember, ThreadMember],
});

// Music player
const { Player } = require("discord-music-player");

const player = new Player(client, {
  leaveOnEmpty: false, // This options are optional.
});

// You can define the Player as *client.player* to easily access it.
client.player = player;

client.commands = new Collection();

//login
client.login(token).then(async () => {
  loadEvents(client);
  loadCommands(client);
  loadDatabase();
  loadUtils();
});
