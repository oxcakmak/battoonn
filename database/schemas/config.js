const { mongoose } = require("../connection/connect");

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

module.exports = { Configs };
