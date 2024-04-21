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
  server: { type: String, default: null },
  ticketId: { type: String, default: null },
  ticket: { type: String, default: null },
  content: { type: String, default: null },
  isPost: { type: Boolean, default: false },
  createdBy: { type: String, default: null },
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
  server: String,
  moduleEnabled: { type: Boolean, default: false },
  category: { type: String, default: null },
  templateChannel: { type: String, default: null },
  templateTitle: { type: String, default: null },
  templateDescription: { type: String, default: null },
  templateButtonText: { type: String, default: null },
  transcriptChannel: { type: String, default: null },
  sendDm: { type: Boolean, default: false },
  role: { type: String, default: null },
});

const TicketConfigs = mongoose.model("ticketConfigs", TicketConfigsSchema);

/*
// Music
const MusicConfigsSchema = new mongoose.Schema({
  server: String,
  channel: { type: String, default: null },
  djRole: { type: String, default: null },
});

const MusicConfigs = mongoose.model("musicConfigs", MusicConfigsSchema);

// Define Mongoose schema and model for Song
const songQueuesSchema = new mongoose.Schema({
  server: String,
  id: {
    // Field for auto-increment
    type: Number,
    unique: true, // Optional if you don't want duplicate IDs
  },
  url: { type: String, default: null },
  thumbnail: { type: String, default: null },
  title: { type: String, default: null },
  channel: { type: String, default: null },
  duration: { type: String, default: null },
  length: { type: String, default: null },
  requestedBy: { type: String, default: null },
  requestedById: { type: String, default: null },
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

const SongQueues = mongoose.model("songQueues", songQueuesSchema);
*/

// Voice Rooms
const VoiceRoomsSchema = new mongoose.Schema({
  server: String,
  channel: { type: String, default: null },
  name: { type: String, default: null },
  limit: { type: String, default: null },
  allowedMembers: [String],
  disallowedMembers: [String],
  createdById: { type: String, default: null },
  createdDateTime: { type: String, default: null },
  canWebcam: { type: Boolean, default: true },
  canScreen: { type: Boolean, default: true },
  canActivity: { type: Boolean, default: true },
});

const VoiceRooms = mongoose.model("voiceRooms", VoiceRoomsSchema);

// Invite Tracker
const InviteTrackerConfigsSchema = new mongoose.Schema({
  server: String,
  channel: { type: String, default: null },
  message: { type: String, default: null },
});

const InviteTrackerConfigs = mongoose.model(
  "inviteTrackerConfigs",
  InviteTrackerConfigsSchema
);

module.exports = {
  Configs,
  Explorers,
  Tickets,
  TicketConfigs,
  VoiceRooms,
  InviteTrackerConfigs,
};
