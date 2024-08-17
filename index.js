const fs = require("fs");
const express = require("express");
const morgan = require("morgan");

const app = express();

// 3rd party  middleware
app.use(morgan("dev"));

//middle to be use on request data
app.use(express.json());

//creating a middelware function
app.use((req, res, next) => {
  console.log("Hello from the Middleware");
  next();
});

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

const getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: tours,
  });
};

const getTour = (req, res) => {
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
};

const createTour = (req, res) => {
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
};

const updateTour = (req, res) => {
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
};

const deleteTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((element) => element.id === id);

  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
};

const getAllUsers = (req, res) => {
  res.status(500).json({
    stsatus: "error",
    message: "This is not yet defined",
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    stsatus: "error",
    message: "This is not yet defined",
  });
};

app.route("/api/v1/tours").get(getAllTours).post(createTour);

app
  .route("/api/v1/tours/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

// users routes
app.route("/api/v1/users/").get(getAllUsers).post(createUser);

const port = 3000;

// start up a server
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
