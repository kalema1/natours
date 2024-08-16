const fs = require("fs");
const express = require("express");

const app = express();

// define routes
/* app.get("/", (req, res) => {
  res
    .status(200)
    .json({ message: "Hello from the server side!", app: "Natours" });
});

app.post("/", (req, res) => {
  res.send("You can post to this URL");
}); */

//read the data from json file before being sent by the api route
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/data/tours-simple.json`)
);

// define api routes
app.get("/api/v1/tours", (req, res) => {
  res.status(200).json({
    status: "success",
    data: tours,
  });
});

const port = 3000;

// start up a server
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
