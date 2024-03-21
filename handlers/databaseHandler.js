//get time local
const time = new Date().toLocaleString("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

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
  return console.log(table.toString(), `\n${time} | Loaded Database.`);
}

module.exports = { loadDatabase };
