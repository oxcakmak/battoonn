const YAML = require("js-yaml");
const fs = require("fs");

// Function to load translations for a specific language
let language = "en";

function _(data, props) {
  const filePath = `locales/${language}.yaml`;

  // Ensure data is a string and language is defined
  if (!data || typeof data !== "string") {
    return data;
  }

  try {
    // Read YAML file and parse data
    const fileData = fs.readFileSync(filePath, "utf8");
    const langData = YAML.load(fileData);

    // Regular expression to match placeholders within double curly braces
    const regex = /\{\{([^\}]+)\}\}/g;

    // Check if data contains placeholders and replace them with values
    if (langData[data]) {
      return langData[data].replace(regex, (match, key) => {
        return props[key] !== undefined ? props[key] : match; // Replace with value or fallback
      });
    } else {
      return data; // Return original data if key not found in YAML
    }
  } catch (error) {
    console.error(
      `Error loading translations for language ${language}:`,
      error
    );
    return data; // Handle errors by returning original data
  }
}

module.exports = { _ };
