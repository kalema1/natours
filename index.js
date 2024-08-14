const express = require("express");

const app = express();

// define routes
app.get("/", (req, res) => {
  res.status(200).send("Hello from the server side!");
});

const port = 3000;

// start up a server
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
