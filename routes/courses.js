const express = require("express");
const Course = require("../models/Course");
const advancedResults = require("../middleware/advancedResults");
const router = express.Router({ mergeParams: true });

// import all controller methods
const {
  getCourses,
  getSingleCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courses");

// protect routes
const { protect, authorize } = require("../middleware/auth");

// routes
router
  .route("/")
  .get(
    advancedResults(Course, {
      path: "bootcamp",
      select: "name description",
    }),
    getCourses
  )
  .post(protect, authorize("publisher", "admin"), createCourse);

router
  .route("/:id")
  .get(getSingleCourse)
  .put(protect, authorize("publisher", "admin"), updateCourse)
  .delete(protect, authorize("publisher", "admin"), deleteCourse);

module.exports = router;
