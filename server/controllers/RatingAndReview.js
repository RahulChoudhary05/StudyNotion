const RatingAndReview = require("../models/RatingAndReviews");
const Course = require("../models/Course");
const mongoose = require("mongoose");

// Create rating and review
exports.createRating = async (req, res) => {
  try {
    // Get user id
    const userId = req.user.id;

    // Fetch data from req body
    const { rating, review, courseId } = req.body;

    // Check if the user is enrolled in the course
    const courseDetails = await Course.findOne({
      _id: courseId,
      studentsEnrolled: { $elemMatch: { $eq: userId } },
    });
    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Student is not enrolled in this course",
      });
    }

    // Check if the user has already reviewed the course
    const alreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    });
    if (alreadyReviewed) {
      return res.status(403).json({
        success: false,
        message: "The course has already been reviewed by the user. Only one review/rating is allowed",
      });
    }

    // Create rating and review
    const ratingReview = await RatingAndReview.create({
      rating,
      review,
      course: courseId,
      user: userId,
    });

    // Update the course with this rating and review
    await Course.findByIdAndUpdate(
      { _id: courseId },
      { $push: { ratingAndReviews: ratingReview._id } },
      { new: true }
    );

    // Return response
    return res.status(200).json({
      success: true,
      message: "Rating and Review created successfully",
      ratingReview,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create Rating and Review",
      error: error.message,
    });
  }
};

// Get average rating for a course
exports.getAverageRating = async (req, res) => {
  try {
    // Get course id
    const courseId = req.body.courseId;

    // Calculate average rating
    const result = await RatingAndReview.aggregate([
      {
        $match: { course: mongoose.Types.ObjectId(courseId) },
      },
      {
        $group: { _id: null, averageRating: { $avg: "$rating" } },
      },
    ]);

    // Return average rating
    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        averageRating: result[0].averageRating,
      });
    }

    // No ratings exist for the course
    return res.status(200).json({
      success: true,
      message: "Average rating is 0 as no ratings have been given for this course",
      averageRating: 0,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to calculate average Rating and Review",
      error: error.message,
    });
  }
};

// Get all ratings and reviews
exports.getAllRating = async (req, res) => {
  try {
    // Fetch all ratings and reviews
    const allReviews = await RatingAndReview.find({})
      .sort({ rating: "descending" })
      .populate({ path: "user", select: "firstName lastName email image" })
      .populate({ path: "course", select: "courseName" })
      .exec();

    // Return response
    return res.status(200).json({
      success: true,
      message: "All reviews fetched successfully",
      data: allReviews,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch all Rating and Review data",
      error: error.message,
    });
  }
};
