const Profile = require("../models/Profile");
const User = require("../models/User");

//update profile, because dummy profile already create in middleware(null)
exports.updateProfile = async (req, res) => {
  try {
    //get data
    const { dateofBirth = "", about = "", gender, contactNumber } = req.body;

    //get userId
    const id = req.user.id;

    //validation
    if (!contactNumber || !gender) {
      return res.status(400).json({
        success: false,
        message: "All field's are required",
      });
    }

    //find profile(already dummy created)
    const userDetails = await User.findById(id);
    const profileId = userDetails.additionalDetail;
    const profileDetails = await Profile.findById(profileId);

    //update profile
    profileDetails.dateofBirth = dateofBirth;
    profileDetails.about = about;
    profileDetails.gender = gender;
    profileDetails, (contactNumber = contactNumber);
    await profileDetails.save();

    //return response
    return res.status(200).json({
      success: true,
      message: "Profile updated Successfully",
      profileDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unable to update Profile, please try again",
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
