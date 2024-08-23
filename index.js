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
  /* res.status(404).json({
    status: "fail",
    message: `Cant find ${req.originalUrl} on this server`,
  }); */

  const err = new Error(`Cant find ${req.originalUrl} on this server`);
  err.status = "fail";
  err.statusCode = 404;

  next(err);
});

// handle the route errors in one central middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
