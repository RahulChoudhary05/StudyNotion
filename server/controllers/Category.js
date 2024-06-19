const Category = require("../models/Category");
const Tag = require("../models/Category");

//create tag handler function
exports.createCategory = async (req, res) => {
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
exports.showAllCategories = async (req, res) => {
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

//categoryPageDetails
exports.categoryPageDetails = async (req, res) => {
  try {
    //get categoryId
    const { categoryId } = req.body;

    // get courses for specified categoryId
    const selectedCategory = await Category.findById(categoryId)
      .populate("Courses")
      .exec();

    //validation
    if (!selectedCategory) {
      return res.status(400).json({
        success: false,
        message: "Data not found",
      });
    }
    //get courses for different category
    const differentCategories = await Category.find({
      _id: { $ne: categoryId }, // ne means not equal
    })
      .populate("courses")
      .exec();

    // Get top-selling courses across all categories
    const allCategories = await Category.find()
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: {
          path: "instructor",
        },
      })
      .exec();
    const allCourses = allCategories.flatMap((category) => category.courses);
    const mostSellingCourses = allCourses
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);
    // console.log("mostSellingCourses COURSE", mostSellingCourses)
    //return responses
    return res.status(200).json({
      success: true,
      message: "All Tags return Successfully",
      data: { selectedCategory, differentCategories, mostSellingCourses },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
