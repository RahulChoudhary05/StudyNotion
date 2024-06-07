const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
require("dotenv").config();

//create subsection
exports.createSubSection = async (req, res) => {
  try {
    //fetch data from req body
    const { sectionId, title, timeDuration, description } = req.body;

    //extract file/video
    const video = req.files.videoFile;

    //validation
    if (!sectionId || !title || !timeDuration || !description) {
      return res.status(400).json({
        success: false,
        message: "All field's are required",
      });
    }

    //upload video to cloudinary
    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );

    //create a sub section
    const subSectionDetails = await SubSection.create({
      title: title,
      timeDuration: timeDuration,
      description: description,
      videoUrl: uploadDetails.secure_url,
    });

    //update section with this subsection ObjectId
    const updateSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $push: {
          subSection: subSectionDetails._id,
        },
      },
      { new: true }
    ).populate("subSection");
    //HW: log updated section here, after adding populate query

    //return response
    return res.status(200).json({
      success: true,
      message: "SubSection created Successfully",
      updateSection,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unable to create subsections, please try again",
      error: error.message,
    });
  }
};

// Update SubSection
exports.updateSubSection = async (req, res) => {
  try {
    const { subSectionId, title, timeDuration, description } = req.body;

    if (!subSectionId) {
      return res.status(400).json({
        success: false,
        message: "SubSection ID is required for updating.",
      });
    }

    const updatedSubSection = await SubSection.findByIdAndUpdate(
      subSectionId,
      {
        title: title,
        timeDuration: timeDuration,
        description: description,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "SubSection updated successfully",
      updatedSubSection,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unable to update SubSection, please try again",
      error: error.message,
    });
  }
};

// Delete SubSection
exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId } = req.body;

    if (!subSectionId) {
      return res.status(400).json({
        success: false,
        message: "SubSection ID is required for deletion.",
      });
    }

    const deletedSubSection = await SubSection.findByIdAndDelete(subSectionId);

    if (!deletedSubSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found for deletion.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "SubSection deleted successfully",
      deletedSubSection,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unable to delete SubSection, please try again",
      error: error.message,
    });
  }
};
