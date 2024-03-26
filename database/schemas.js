const { mongoose } = require("./connect");

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

// Tickets
const TicketsSchema = new mongoose.Schema({
  server: String,
  parent: { type: String, default: "-" },
  ticket: String,
  isPost: { type: Boolean, default: false },
  content: String,
  createdBy: String,
  createdAt: String,
  closedAt: String,
});

const Tickets = mongoose.model("tickets", TicketsSchema);

module.exports = { Configs, Explorers, Tickets, TicketConfigs };
