const Section = require("../models/Section");
const Course = require("../models/Course");

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
