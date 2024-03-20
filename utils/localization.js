const YAML = require("js-yaml");
const fs = require("fs");

const { mongoose } = require("../database/connect");

function _(data, props, serverId = null) {
  // Access the model associated with the 'configs' collection
  const Config = mongoose.model("configs");
  let language;
  let filePath = `./locales/${language}.yml`;

  // Perform the query and handle the promise
  if (serverId) {
    Config.findOne({ server: serverId }).then((document) => {
      if (document) {
        language = document.displayLanguage;
        filePath = "./locales/" + document.displayLanguage + ".yml";
      }
    });
  } else {
    language = "en";
    filePath = "./locales/en.yml";
  }
  console.log(language);

  // const filePath = `./locales/${language}.yml`;

  // Ensure data is a string and language is defined
  if (!data || typeof data !== "string") return data;

  // Read YAML file and parse data
  const fileData = fs.readFileSync(filePath, "utf8");
  const langData = YAML.load(fileData);

  // Regular expression to match placeholders within double curly braces
  const regex = /\{\{([^\}]+)\}\}/g;

  // Check if data contains placeholders and replace them with values
  if (langData[data])
    return langData[data].replace(regex, (match, key) => {
      return props[key] !== undefined ? props[key] : match; // Replace with value or fallback
    });

  return data; // Return original data if key not found in YAML
}

module.exports = {
  _,
};
