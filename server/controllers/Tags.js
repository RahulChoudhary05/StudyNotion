const Tag = require("../models/togs");

//create tag handler function
exports.createTag = async (req, res) => {
  try {
    //data fetch
    const { name, description } = req.body;

    //validation
    if (!name || description) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    //create entry in db
    const tagDetails = await Tag.create({
      name: name,
      description: description,
    });
    console.log(tagDetails);

    return res.status(200).json({
      success: true,
      message: "Tags created Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get all tags handler function
exports.showAlltags = async (req, res) => {
  try {
    const allTags = await Tag.find({}, { name: true, description: true });

    return res.status(200).json({
      success: true,
      message: "All Tags return Successfully",
      allTags,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
