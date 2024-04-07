const { mongoose } = require("./connect");

// Configs
const ConfigsSchema = new mongoose.Schema({
  server: String,
  premiumLeft: { type: Number, default: 0 },
  premiumEnabled: { type: Boolean, default: false },
  commandChannel: { type: String, default: null },
  responseChannel: { type: String, default: null },
  announcementChannel: { type: String, default: null },
  allowedChannels: [String],
  forumSolvedText: { type: String, default: null },
  forumAllowedRole: { type: String, default: null },
});

const Configs = mongoose.model("configs", ConfigsSchema);

// Explorer
const ExplorerSchema = new mongoose.Schema({
  server: String,
  moduleEnabled: { type: Boolean, default: false },
  givenRole: { type: String, default: null },
  notifyChannel: { type: String, default: null },
  joinMessage: { type: String, max: 200, default: null },
  leaveMessage: { type: String, max: 200, default: null },
  autoTag: { type: String, default: null },
  autoTagPosition: {
    type: String,
    enum: ["per", "end"],
    default: null,
  },
});

const Explorers = mongoose.model("explorers", ExplorerSchema);

// Tickets
const TicketsSchema = new mongoose.Schema({
  id: {
    // Field for auto-increment
    type: Number,
    unique: true, // Optional if you don't want duplicate IDs
  },
  server: String,
  ticketId: String,
  ticket: String,
  content: String,
  isPost: { type: Boolean, default: false },
  createdBy: String,
  createdAt: String,
});

TicketsSchema.pre("save", async function (next) {
  // Only increment on new documents
  if (!this.isNew) return next();
  // Get existing document count
  const docCount = await Tickets.countDocuments({});
  // Assign ID as count + 1
  this.id = docCount + 1;
  next();
});

const Tickets = mongoose.model("tickets", TicketsSchema);

// Ticket Configs
const TicketConfigsSchema = new mongoose.Schema({
  server: String,
  moduleEnabled: { type: Boolean, default: false },
  category: String,
  templateChannel: String,
  templateTitle: String,
  templateDescription: String,
  templateButtonText: String,
  role: String,
});

const TicketConfigs = mongoose.model("ticketConfigs", TicketConfigsSchema);

// Music
const MusicConfigsSchema = new mongoose.Schema({
  server: String,
  channel: { type: String, default: null },
  djRole: { type: String, default: null },
  spotifyClientId: { type: String, default: null },
  spotifyClientSecret: { type: String, default: null },
  /* templateDescription: { type: String, default: null }, */
});

const MusicConfigs = mongoose.model("musicConfigs", MusicConfigsSchema);

// Define Mongoose schema and model for Song
const songQueuesSchema = new mongoose.Schema({
  server: Number,
  id: {
    // Field for auto-increment
    type: Number,
    unique: true, // Optional if you don't want duplicate IDs
  },
  voiceChannel: String,
  targetChannel: String,
  url: String,
  thumbnail: String,
  title: String,
  channelOwner: String,
  duration: String,
  length: Number,
  requestBy: String,
  requestById: Number,
  requestedTime: String,
});

songQueuesSchema.pre("save", async function (next) {
  // Only increment on new documents
  if (!this.isNew) return next();
  // Get existing document count
  const docCount = await SongQueues.countDocuments({});
  // Assign ID as count + 1
  this.id = docCount + 1;
  next();
});

const SongQueues = mongoose.model("songQueues", songQueuesSchema);

module.exports = {
  Configs,
  Explorers,
  Tickets,
  TicketConfigs,
  MusicConfigs,
  SongQueues,
};
