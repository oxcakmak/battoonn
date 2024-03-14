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

/*
async function _(data, props) {
  const filePath = `locales/${language}.yaml`;
  let langData;

  if (!data || typeof data !== "string") {
    return data; // Handle non-string data
  }

  try {
    const fileData = await fs.readFileSync(filePath, "utf8");
    langData = YAML.load(fileData); // Load YAML data

    // Regular expression to match key-value pairs within curly braces
    const regex = /\{\{([^\}]+)\}\}/g;

    // Apply replacement
    langData[data].replace(regex, (match, key) => {
      const value = props[key] || match; // Use value from props or fallback to match
    });
    return value;
  } catch (error) {
    console.error(
      `Error loading translations for language ${language}:`,
      error
    );
    return {}; // Handle missing file (return empty object)
  }
}

*/

// (Optional - for PO files)
// If using PO files, you'll need to set up Gettext context and potentially pluralization rules.
// Refer to Gettext documentation for details.
module.exports = { _ };
