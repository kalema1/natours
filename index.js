const express = require("express");

const app = express();

// define routes
app.get("/", (req, res) => {
  res
    .status(200)
    .json({ message: "Hello from the server side!", app: "Natours" });
});

const port = 3000;

// start up a server
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
