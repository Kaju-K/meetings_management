const express = require("express");

require("dotenv").config();

require("./commands/slashCommands.js");
require("./commands/messageCommands.js");

const app = express();

app.get("/", (req, res) => {
  res.json({ success: true });
});

app.listen(process.env.PORT);
