const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Get course
// @route   GET /api/v1/courses
// @route   GET /api/v1/:bootcampId/courses
// @access  Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;

  // find courses by bootcamp ID
  // populate bootcamp info in courses
  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId }).populate({
      path: "bootcamp",
      select: "name description",
    });

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } else {
    return res.json(res.advancedResults);
  }
});

// @desc    Get single course
// @route   GET /api/v1/courses/:id
// @access  Public
exports.getSingleCourse = asyncHandler(async (req, res, next) => {
  // find courses by bootcamp ID
  // populate bootcamp info in courses
  const course = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });

  if (!course) {
    return next(
      new ErrorResponse(`No course found with id of ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc    Create a course
// @route   POST /api/v1/:bootcampId/courses/
// @access  Private
exports.createCourse = asyncHandler(async (req, res, next) => {
  // Add bootcamp id to the course body
  req.body.bootcamp = req.params.bootcampId;

  // Add user to req.body
  req.body.user = req.user.id;

  // search for bootcamp
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  // check if bootcamp exits
  if (!bootcamp) {
    return next(
      new ErrorResponse(`No bootcamp found with id of ${req.params.bootcampId}`)
    );
  }

  // Make sure user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to add a course to bootcamp ${bootcamp._id}`,
        401
      )
    );
  }

  // create the new course
  const course = await Course.create(req.body);

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc    Update a course
// @route   PUT /api/v1/courses/:id
// @access  Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  // update course if it exists
  let course = await Course.findById(req.params.id);

  // return error if course does not exist
  if (!course) {
    return next(
      new ErrorResponse(`No course found with id of ${req.params.id}`)
    );
  }

  // Make sure user is course owner
  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update course ${course._id}`,
        401
      )
    );
  }

  course = await Course.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc    Delete a course
// @route   DELETE /api/v1/courses/:id
// @access  Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  // update course if it exists
  const course = await Course.findById(req.params.id);

  // return error if course does not exist
  if (!course) {
    return next(
      new ErrorResponse(`No course found with id of ${req.params.id}`)
    );
  }

  // Make sure user is course owner
  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete course ${course._id}`,
        401
      )
    );
  }

  course.remove();

  res.status(200).json({
    success: true,
    data: course,
  });
});
