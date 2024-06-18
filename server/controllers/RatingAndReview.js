const RatingAndReview = require("../models/RatingAndReviews");
const Course = require("../models/Course");
const mongoose = require("mongoose");

//create rating
exports.createRating = async (req, res) => {
  try {
    //get user id
    const userId = req.user.id;

    //fetchdata from req body
    const { rating, review, courseId } = req.body;

    //check if user is enrolled or not
    const courseDetails = await Course.findOne({
      _id: courseId,
      studentsEnrolled: { $eleMatch: { $eq: userId } },
    });
    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Student is not enrolled this course",
      });
    }

    //check user already reviewed the course
    const alreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    });
    if (!alreadyReviewed) {
      return res.status(403).json({
        success: false,
        message:
          "Course is already reviewed by the user, only one time review/rating",
      });
    }

    //create rating and review
    const ratingReview = await RatingAndReview.create({
      rating,
      review,
      course: courseId,
      user: userId,
    });

    //update course with this reading review
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      { _id: courseId },
      {
        $push: { ratingAndReviews: ratingReview._id },
      },
      { new: true }
    );
    console.log(updatedCourseDetails);

    //return response
    return res.status(200).json({
      success: true,
      message: "Raing And Review created successfully",
      ratingReview,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Rating and Review not created",
      error: error.message,
    });
  }
};

//getAverageRating
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

    //return rating
    if (result.length) {
      return res.status(200).json({
        success: true,
        averageRating: result[0].alreadyReviewed,
      });
    }

    //if no rating review exist
    return res.status(200).json({
      success: true,
      message: "Average rating is 0 no rating given till now",
      averageRating: 0,
    });

    //   // Check if result is not empty
    //   const averageRating = result.length > 0 ? result[0].averageRating : 0;

    // Return the average rating
    return res.status(200).json({
      success: true,
      averageRating: averageRating,
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

//getAllRatingAndReviews
exports.getAllRating = async (req, res) => {
  try {
    //fetch all raring and review
    const allReviews = await RatingAndReview.find({})
      .sort({ rating: "descending" })
      .populate({ path: "user", select: "firstName lastName email image" })
      .populate({ path: "course", select: "courseName" })
      .exec();

    //return response
    return res.status(200).json({
      success: true,
      message: "All review fetch successfully",
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
