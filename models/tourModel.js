const { Schema, model } = require("mongoose");
const slugify = require("slugify");

// create the tour schema
const tourSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "A Tour mush have a name"],
      unique: true,
      trim: true,
    },
    slug: { type: String },
    duration: {
      type: Number,
      required: [true, "A Tour mush have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A Tour mush have a group size"],
    },
    difficulty: {
      type: String,
      required: [true, "A Tour mush have a difficulty"],
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A Tour mush have a price"],
    },
    priceDiscount: {
      type: Number,
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A Tour mush have a summary"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A Tour mush have a cover image"],
    },
    image: {
      type: [String],
    },
    startDates: {
      type: [Date],
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// create the virtual property
tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

// mongoose document middleware called b4 the document is saved or created
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//create the tour  model
const Tour = model("Tour", tourSchema);

module.exports = Tour;
