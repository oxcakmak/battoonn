const { formattedCurrentDateTime } = require("../utils/dateFunctions");

function loadDatabase() {
  const ascii = require("ascii-table");
  const fs = require("fs");
  const table = new ascii().setHeading("Database", "Status");

  /*
  const databaseFolder = fs.readdirSync("./database");
  for (const folder of databaseFolder) {
    const databaseFiles = fs
      .readdirSync(`./database/${folder}`)
      .filter((file) => file.endsWith(".js"));

    for (const file of databaseFiles) {
      require(`../database/${folder}/${file}`);

      table.addRow(`database/${folder}/${file}`, "OK");
      continue;
    }
  }
  */

  const databaseFolder = fs
    .readdirSync("./database")
    .filter((file) => file.endsWith(".js"));

  for (const file of databaseFolder) {
    const databaseFile = require(`../database/${file}`);

    table.addRow(`database/${file}`, "OK");
    continue;
  }
  return console.log(
    table.toString(),
    `\n${formattedCurrentDateTime} | Loaded Database.`
  );
}

module.exports = { loadDatabase };
