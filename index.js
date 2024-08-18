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

const port = 3000;

// start up a server
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
