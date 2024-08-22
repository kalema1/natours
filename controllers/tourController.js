const Tour = require("../models/tourModel");

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // 1A) Filtering
    const queryObject = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];

    excludedFields.forEach((element) => delete queryObject[element]);

    // 1B) Advanced Filtering
    let queryString = JSON.stringify(queryObject);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    this.query = Tour.find(JSON.parse(queryString));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      console.log(sortBy);
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-timestamps");
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

exports.getAllTours = async (req, res) => {
  try {
    //BULD A QUERY
    /* // 1A) Filtering
    const queryObject = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];

    excludedFields.forEach((element) => delete queryObject[element]);

    // 1B) Advanced Filtering
    let queryString = JSON.stringify(queryObject);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    ); */

    // let query = Tour.find(JSON.parse(queryString));

    // 2) Sorting
    /* if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      console.log(sortBy);
      query = query.sort(sortBy);
    } else {
      query = query.sort("-timestamps");
    } */

    // 3) Pagination
    /* const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numberOfTours = await Tour.countDocuments();

      if (skip >= numberOfTours) {
        throw new Error("page does not exist");
      }
    } */

    // EXECUTE THE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .paginate();
    const tours = await features.query;

    //  SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: tours.length,
      data: tours,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail to get data",
      message: error,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: tour,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail to get data",
      message: error,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: "success",
      data: { tour: newTour },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: tour,
    });
  } catch (error) {
    res.status(404).json({
      status: "failed to update data",
      message: error,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      status: "failed to delete data",
      message: error,
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      { $match: { ratingsAverage: { $gte: 4.5 } } },
      {
        $group: {
          _id: null,
          numTours: { $sum: { $sum: 1 } },
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      data: stats,
    });
  } catch (error) {
    res.status(404).json({
      status: "failed to get data",
      message: error,
    });
  }
};
