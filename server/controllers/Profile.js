const Profile = require("../models/Profile");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

//update profile, because dummy profile already create in middleware(null)
exports.updateProfile = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      dateofBirth = "",
      about = "",
      contactNumber = "",
      gender = "",
    } = req.body;
    const id = req.user.id;

    // Find the user by id and populate additionalDetail
    const userDetails = await User.findById(id)
      .populate("additionalDetail")
      .exec();
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const profileId = userDetails.additionalDetail._id;
    console.log("Profile ID:", profileId); // Log the profileId

    const profile = await Profile.findById(profileId);

    // Check if profile exists
    if (!profile) {
      console.log("Profile not found");
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    // Update the user's firstName and lastName only if they are provided
    if (firstName) {
      userDetails.firstName = firstName;
    }
    if (lastName) {
      userDetails.lastName = lastName;
    }

    await userDetails.save();

    // Update the profile fields
    profile.dateofBirth = dateofBirth;
    profile.about = about;
    profile.contactNumber = contactNumber;
    profile.gender = gender;

    await profile.save();

    // Find the updated user details
    const updatedUserDetails = await User.findById(id)
      .populate("additionalDetail")
      .exec();

    return res.json({
      success: true,
      message: "Profile updated successfully",
      updatedUserDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//delete profile(deleteAccount)
exports.deleteAccount = async (req, res) => {
  try {
    //get id(delete account)
    const id = req.user.id;

    //validation
    const userDetails = await User.findById(id);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    //delete profile
    await Profile.findByIdAndDelete({ _id: userDetails.additionalDetail });

    //HW: unerroll user from all enrolled courses
    //delete user
    await User.findByIdAndDelete({ _id: id });

    //return response
    return res.status(200).json({
      success: true,
      message: "User deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "User can't delete Successfully",
      error: error.message,
    });
  }
};

//fetch all user details
exports.getAllUserDetails = async (req, res) => {
  try {
    //get id
    const id = req.user.id;

    //validation and get user details
    const userDetails = await User.findById(id)
      .populate("additionalDetail")
      .exec();

    //return response
    return res.status(200).json({
      success: true,
      message: "User data fetched Successfully",
      userDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "User all details can't fetch Successfully",
      error: error.message,
    });
  }
};

//update pic
exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture;
    const userId = req.user.id;
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    );
    console.log(image);
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    );
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id
    let userDetails = await User.findOne({
      _id: userId,
    })
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec()
    userDetails = userDetails.toObject()
    var SubsectionLength = 0
    for (var i = 0; i < userDetails.courses.length; i++) {
      let totalDurationInSeconds = 0
      SubsectionLength = 0
      for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
        totalDurationInSeconds += userDetails.courses[i].courseContent[
          j
        ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
        userDetails.courses[i].totalDuration = convertSecondsToDuration(
          totalDurationInSeconds
        )
        SubsectionLength +=
          userDetails.courses[i].courseContent[j].subSection.length
      }
      let courseProgressCount = await CourseProgress.findOne({
        courseID: userDetails.courses[i]._id,
        userId: userId,
      })
      courseProgressCount = courseProgressCount?.completedVideos.length
      if (SubsectionLength === 0) {
        userDetails.courses[i].progressPercentage = 100
      } else {
        // To make it up to 2 decimal point
        const multiplier = Math.pow(10, 2)
        userDetails.courses[i].progressPercentage =
          Math.round(
            (courseProgressCount / SubsectionLength) * 100 * multiplier
          ) / multiplier
      }
    }

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      })
    }
    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.instructorDashboard = async (req, res) => {
  try {
    const courseDetails = await Course.find({ instructor: req.user.id })

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentsEnroled.length
      const totalAmountGenerated = totalStudentsEnrolled * course.price

      // Create a new object with the additional fields
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        // Include other course properties as needed
        totalStudentsEnrolled,
        totalAmountGenerated,
      }

      return courseDataWithStats
    })

    res.status(200).json({ courses: courseData })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
}