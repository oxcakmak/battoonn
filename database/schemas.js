const { mongoose } = require("./connect");

// Configs
const ConfigsSchema = new mongoose.Schema({
  server: Number,
  premiumLeft: { type: Number, default: 0 },
  premiumEnabled: { type: Boolean, default: false },
  commandChannel: { type: Number, default: null },
  responseChannel: { type: Number, default: null },
  announcementChannel: { type: Number, default: null },
  allowedChannels: [Number],
  forumSolvedText: { type: String, default: null },
  forumAllowedRole: { type: String, default: null },
});

const Configs = mongoose.model("configs", ConfigsSchema);

// Explorer
const ExplorerSchema = new mongoose.Schema({
  server: Number,
  moduleEnabled: { type: Boolean, default: false },
  givenRole: { type: String, default: null },
  notifyChannel: { type: Number, default: null },
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
  server: { type: Number, default: null },
  ticketId: { type: Number, default: null },
  ticket: { type: String, default: null },
  content: { type: String, default: null },
  isPost: { type: Boolean, default: false },
  createdBy: { type: Number, default: null },
  createdAt: { type: String, default: null },
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
  server: Number,
  moduleEnabled: { type: Boolean, default: false },
  category: { type: Number, default: null },
  templateChannel: { type: Number, default: null },
  templateTitle: { type: String, default: null },
  templateDescription: { type: String, default: null },
  templateButtonText: { type: String, default: null },
  transcriptChannel: { type: Number, default: null },
  sendDm: { type: Boolean, default: null },
  role: { type: Number, default: null },
});

const TicketConfigs = mongoose.model("ticketConfigs", TicketConfigsSchema);

// Music
const MusicConfigsSchema = new mongoose.Schema({
  server: Number,
  channel: { type: Number, default: null },
  djRole: { type: Number, default: null },
  /* templateDescription: { type: String, default: null }, */
});

const MusicConfigs = mongoose.model("musicConfigs", MusicConfigsSchema);

// Define Mongoose schema and model for Song
const songQueuesSchema = new mongoose.Schema({
  server: Number,
  /*
  id: {
    // Field for auto-increment
    type: Number,
    unique: true, // Optional if you don't want duplicate IDs
  },
  */
  url: { type: String, default: null },
  thumbnail: { type: String, default: null },
  title: { type: String, default: null },
  channel: { type: Number, default: null },
  duration: { type: String, default: null },
  length: { type: Number, default: null },
  requestedBy: { type: String, default: null },
  requestedById: { type: Number, default: null },
  requestedTime: { type: Date, default: null },
});

/*
songQueuesSchema.pre("save", async function (next) {
  // Only increment on new documents
  if (!this.isNew) return next();
  // Get existing document count
  const docCount = await SongQueues.countDocuments({});
  // Assign ID as count + 1
  this.id = docCount + 1;
  next();
});
*/

const SongQueues = mongoose.model("songQueues", songQueuesSchema);

module.exports = {
  Configs,
  Explorers,
  Tickets,
  TicketConfigs,
  MusicConfigs,
  SongQueues,
};
