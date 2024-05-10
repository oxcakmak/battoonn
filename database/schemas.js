const { mongoose } = require("./connect");

// Auto Mod Rules
const AutoModRulesSchema = new mongoose.Schema({
  server: String,
  type: String,
  perAbove: String,
  perMultiplier: { type: String, default: 1 },
  actionBeTaken: String,
  durationType: {
    type: String,
    enum: ["i", "h", "d", "w", "m", "y"],
    default: "i",
  },
  durationConverted: String,
  duration: String,
});

/*
 * actionBeTaken:
 * durationType: i=Minutes, h=Hours, d=Days, w=Weeks, m=Months, y=Years
 */

const AutoModRules = mongoose.model("autoModRules", AutoModRulesSchema);

// Configs
const ConfigsSchema = new mongoose.Schema({
  server: String,
  premiumLeft: { type: Number, default: 0 },
  premiumEnabled: { type: Boolean, default: false },
  announcementChannel: { type: String, default: null },
  backupChannel: { type: String, default: null },
  commandChannel: { type: String, default: null },
  logChannel: { type: String, default: null },
  responseChannel: { type: String, default: null },
  warningChannel: { type: String, default: null },
  forumSolvedText: { type: String, default: null },
  forumAllowedRole: { type: String, default: null },
  allowedChannels: [String],
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

// Forum Transactions
const ForumTransactionsSchema = new mongoose.Schema({
  server: String,
  threadId: { type: String, default: null },
  moderationById: { type: String, default: null },
  moderationType: {
    type: String,
    enum: ["solve", "lock"],
    default: null,
  },
});

const ForumTransactions = mongoose.model(
  "forumTransactions",
  ForumTransactionsSchema
);

// Giveaways
const GiveawaysSchema = new mongoose.Schema({
  server: String,
  code: {
    // Field for auto-increment
    type: Number,
    unique: true, // Optional if you don't want duplicate IDs
  },
  messageId: { type: String, default: null },
  channelId: { type: String, default: null },
  voiceId: { type: String, default: null },
  description: { type: String, default: null },
  winners: { type: Number, default: 0 },
  winnersList: [String],
  reserves: { type: Number, default: 0 },
  reservesList: [String],
  role: { type: String, default: null },
  limit: { type: Number, default: null },
  startAt: { type: String, default: null },
  endAt: { type: String, default: null },
  ended: { type: Boolean, default: false },
  participants: [String],
  blacklist: [String],
  createdById: { type: String, default: null },
  createdByDateTime: { type: String, default: null },
  createdByChannel: { type: String, default: null },
});

GiveawaysSchema.pre("save", async function (next) {
  // Only increment on new documents
  if (!this.isNew) return next();
  // Get existing document count
  const docCount = await Giveaways.countDocuments({});
  // Assign ID as count + 1
  this.code = docCount + 1;
  next();
});

const Giveaways = mongoose.model("giveaways", GiveawaysSchema);

// Invite Tracker
const InviteTrackerConfigsSchema = new mongoose.Schema({
  server: String,
  moduleEnabled: { type: Boolean, default: false },
  channel: { type: String, default: null },
  message: { type: String, default: null },
});

const InviteTrackerConfigs = mongoose.model(
  "inviteTrackerConfigs",
  InviteTrackerConfigsSchema
);

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

// User

// Voice Rooms
const VoiceRoomsSchema = new mongoose.Schema({
  server: String,
  channel: { type: String, default: null },
  name: { type: String, default: null },
  primaryOwnerId: { type: String, default: null },
  secondaryOwnerId: { type: String, default: null },
  createdById: { type: String, default: null },
  createdDateTime: { type: String, default: null },
});

const VoiceRooms = mongoose.model("voiceRooms", VoiceRoomsSchema);

module.exports = {
  AutoModRules,
  Configs,
  Explorers,
  ForumTransactions,
  Giveaways,
  InviteTrackerConfigs,
  Tickets,
  TicketConfigs,
  VoiceRooms,
};
