const { mongoose } = require("./connect");
const autoIncrement = require("mongoose-auto-increment");

autoIncrement.initialize(mongoose);

// Configs
const ConfigsSchema = new mongoose.Schema({
  server: String,
  premiumStart: { type: String, max: 20, default: null },
  premiumEnd: { type: String, max: 20, default: null },
  premiumEnabled: { type: Boolean, default: false },
  commandChannel: { type: String, max: 20, default: null },
  responseChannel: { type: String, max: 20, default: null },
  displayLanguage: { type: String, min: 2, max: 2, default: "en" },
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
  parent: { type: String, default: "-" },
  ticketId: String,
  ticket: String,
  content: String,
  isPost: { type: Boolean, default: false },
  createdBy: String,
  createdAt: String,
});

TicketsSchema.pre("save", async function (next) {
  if (!this.isNew) {
    // Only increment on new documents
    return next();
  }

  const docCount = await Tickets.countDocuments({}); // Get existing document count
  this.id = docCount + 1; // Assign ID as count + 1
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
