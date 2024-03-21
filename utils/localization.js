const YAML = require("js-yaml");
const fs = require("fs");

let language = "en";
function _(data, props) {
  const filePath = `./locales/${language}.yml`;

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
