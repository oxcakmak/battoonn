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
  givenRole: { type: String, max: 20, default: null },
  notifyChannel: { type: String, max: 20, default: null },
  joinMessage: { type: String, max: 200, default: null },
  leaveMessage: { type: String, max: 200, default: null },
  autoTag: { type: String, max: 20, default: null },
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

module.exports = { Configs, Explorers, Tickets, TicketConfigs };
