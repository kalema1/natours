const express = require("express");
const morgan = require("morgan");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

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

//mounting the routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tours", tourRouter);

// handle error if the url does not exist
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `Cant find ${req.originalUrl} on this server`,
  });
});

module.exports = app;
