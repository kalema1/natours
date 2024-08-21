const { Schema, model } = require("mongoose");

// create the tour schema
const tourSchema = new Schema({
  name: {
    type: String,
    required: [true, "A Tour mush have a name"],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, "A Tour mush have a price"],
  },
});

//create the tour  model
const Tour = model("Tour", tourSchema);

module.exports = Tour;
