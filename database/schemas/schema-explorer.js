const { mongoose } = require("../connection/connect");

const ExplorerSchema = new mongoose.Schema({
  server: String,
  moduleEnabled: { type: Boolean, default: false },
  givenRole: { type: String, max: 20, default: null },
  notifyChannel: { type: String, max: 20, default: null },
  joinMessage: { type: String, max: 200, default: null },
  leaveMessage: { type: String, max: 200, default: null },
});

const Explorer = mongoose.model("explorer", ExplorerSchema);

module.exports = { Explorer };
