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
//Explore -> how can we schedule this deletion operation
exports.deleteAccount = async (req, res) => {
  try {
    //get id(delete account id)
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
