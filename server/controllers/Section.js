const Section = require("../models/Section");
const Course = require("../models/Course");

//create section
exports.createSection = async (req, res) => {
  try {
    //data fetch
    const { sectionName, coueseId } = req.body;

    //data validation
    if (!sectionName || !coueseId) {
      return res.status(400).json({
        success: false,
        message: "Missing Properties",
      });
    }

    //create section
    const newSection = await Section.create({ sectionName });

    //update course schema to add the section objectid
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      coueseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    ).populate("courseContent");
    //HW: use populate to replace sections/subsection both in the updatedCourseDatails
    //return response
    return res.status(200).json({
      success: true,
      message: "Section created Successfully",
      updatedCourseDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unable to create sections, please try again",
      error: error.message,
    });
  }
};

//update the section
exports.updateSection = async (req, res) => {
  try {
    //data input
    const { sectionName, sectionId } = req.body;

    //data validation
    if (!sectionName || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "Missing Properties",
      });
    }

    //update data
    const section = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );

    //return response
    return res.status(200).json({
      success: true,
      message: "Section updated Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unable to Update sections, please try again",
      error: error.message,
    });
  }
};

// delete section
exports.deleteSection = async (req, res) => {
    try {
      //data input
      const {sectionId } = req.params
  
      //delete data
      await Section.findByIdAndDelete(sectionId);
  
      //return response
      return res.status(200).json({
        success: true,
        message: "Section delete Successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Unable to Update sections, please try again",
        error: error.message,
      });
    }
  };