const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("./index");

dotenv.config({ path: "./.env" });

const database = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

let isConnected = false;

async function connectDB() {
  mongoose.set("strictQuery", true);

  // if connected to the database, dont connect again
  if (isConnected) {
    console.log("MongoDB is already Connected...");
    return;
  }

  //connect to MongoDB Database

  try {
    await mongoose.connect(database);
    isConnected = true;
    console.log("MongoDB connected...");
  } catch (error) {
    console.log(error);
  }
}

connectDB();

const port = 3000;

// start up a server
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
