const Course = require("../models/Course");
const Tag = require("../models/tags");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

//create Course handler function
exports.createCourse = async (req, res) => {
  try {
    //fetch the data from db
    const {courseName, courseDescription, whatYouWillLearn, price, tag} = req.body;

    //get thumbnail
    const  thumbnail = req.files.thumbnailImage;

    //validation
    if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnail){
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
    }

    //check for instructor
    const userID = req.user.id;
    const instructorDetails = await User.findById(userID);
    console.log("Instructor Details :", instructorDetails);

    if(!instructorDetails){
    return res.status(404).json({
      success: false,
      message: "Instructor details not found",
    });
    }

    //check given tag is valid or not
    const tagDetails = await Tag.findById(tag);
    if(!tagDetails){
        return res.status(404).json({
            success: false,
            message: "Tags details not found",
          });
    }

    //upload Image top cloudinary
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong in Course section",
    });
  }
};
//get all course handle function
