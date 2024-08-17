const fs = require("fs");
const express = require("express");

const app = express();

//middle to be use on request data
app.use(express.json());

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
    results: tours.length,
    data: tours,
  });
});

// handle get request of a single data item
app.get("/api/v1/tours/:id", (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((element) => element.id === id);

  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

  res.status(200).json({
    status: "success",
    data: tour,
  });
});

// handle post request
app.post("/api/v1/tours", (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: "success",
        data: { tour: newTour },
      });
    }
  );
});

// handling a patch request
app.patch("/api/v1/tours/:id", (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((element) => element.id === id);

  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

  res.status(200).json({
    status: "success",
    data: { tour: "<Updataed tour here...>" },
  });
});

const port = 3000;

// start up a server
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
