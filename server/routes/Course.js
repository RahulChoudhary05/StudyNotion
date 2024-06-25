const express = require("express");
const router = express.Router();

// Importing Course Controllers
const {
  createCourse,
  getAllCourses,
  getCourseDetails,
  getFullCourseDetails,
  editCourse,
  getInstructorCourses,
  deleteCourse,
} = require("../controllers/Course");

// Importing Category Controllers
const {
  showAllCategories,
  createCategory,
  categoryPageDetails,
} = require("../controllers/Category");

// Importing Section Controllers
const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section");

// Importing Sub-Section Controllers
const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/Subsection");

// Importing Rating Controllers
const {
  createRating,
  getAverageRating,
  getAllRating,
} = require("../controllers/RatingAndReview");

// Importing Middlewares
const {
  auth,
  isInstructor,
  isStudent,
  isAdmin,
} = require("../middlewares/auth");

const { updateCourseProgress } = require("../controllers/courseProgress");

// ********************************************************************************************************
//                                      Course routes (only by Instructors)
// ********************************************************************************************************
router.post("/createCourse", auth, isInstructor, createCourse); // Courses can Only be Created by Instructors
router.post("/addSection", auth, isInstructor, createSection); // Add a Section to a Course
router.post("/updateSection", auth, isInstructor, updateSection); // Update a Section
router.post("/deleteSection", auth, isInstructor, deleteSection); // Delete a Section
router.post("/updateSubSection", auth, isInstructor, updateSubSection); // Edit Sub Section
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection); // Delete Sub Section
router.post("/addSubSection", auth, isInstructor, createSubSection); // Add a Sub Section
router.get("/getAllCourses", getAllCourses); // Get all Registered Courses
router.post("/getCourseDetails", getCourseDetails); // Get Details for a Specific Course
router.post("/getFullCourseDetails", auth, getFullCourseDetails); // Get Full Details for a Specific Course
router.post("/editCourse", auth, isInstructor, editCourse); // Edit Course
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses); // Get all Courses Under a Specific Instructor
router.delete("/deleteCourse", deleteCourse); // Delete a Course
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress); // Update Course Progress

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
router.post("/createCategory", auth, isAdmin, createCategory); // Create a Category
router.get("/showAllCategories", showAllCategories); // Show all Categories
router.post("/getCategoryPageDetails", categoryPageDetails); // Get Category Page Details

// ********************************************************************************************************
//                                      Rating and Review (only by Student)
// ********************************************************************************************************
router.post("/createRating", auth, isStudent, createRating); // Create a Rating
router.post("/getAverageRating", getAverageRating); // Get Average Rating
router.get("/getReviews", getAllRating); // Get all Reviews

module.exports = router;
