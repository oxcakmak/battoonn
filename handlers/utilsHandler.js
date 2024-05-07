const { formattedCurrentDateTime } = require("../utils/dateFunctions");

function loadUtils() {
  const ascii = require("ascii-table");
  const fs = require("fs");
  const table = new ascii().setHeading("Utils", "Status");

  const utilsFolder = fs
    .readdirSync("./utils")
    .filter((file) => file.endsWith(".js"));

  for (const file of utilsFolder) {
    const utilsFile = require(`../utils/${file}`);

    table.addRow(`utils/${file}`, "OK");
    continue;
  }

  return console.log(
    table.toString(),
    `\n${formattedCurrentDateTime} | Loaded Utils.`
  );
}

module.exports = { loadUtils };
