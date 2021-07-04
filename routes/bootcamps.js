const express = require("express");
const courses = require("./courses");
const reviews = require("./reviews");
const advancedResults = require("../middleware/advancedResults");
const Bootcamp = require("../models/Bootcamp");
const router = express.Router();

// import all controller methods
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampInRadius,
  bootcampPhotoUpload,
} = require("../controllers/bootcamps");

// protect route middleware
const { protect, authorize } = require("../middleware/auth");

// re-route to courses routes if :bootcamp ID exists
router.use("/:bootcampId/courses", courses);
router.use("/:bootcampId/reviews", reviews);

// bootcamp routes
router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcamps)
  .post(protect, authorize("publisher", "admin"), createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, authorize("publisher", "admin"), updateBootcamp)
  .delete(protect, authorize("publisher", "admin"), deleteBootcamp);

router
  .route("/:id/photo")
  .put(protect, authorize("publisher", "admin"), bootcampPhotoUpload);

router.route("/radius/:zipcode/:distance/:unit").get(getBootcampInRadius);

module.exports = router;
