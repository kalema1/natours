const express = require("express");
const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  getTourStats,
} = require("../controllers/tourController");
const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router();

//param middleware
//router.param("id", checkID);

router.route("/tour-stats").get(getTourStats);

router.route("/").get(protect, getAllTours).post(createTour);

router
  .route("/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(protect, restrictTo("admin", "lead - guide"), deleteTour);

module.exports = router;
