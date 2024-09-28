const mongoose = require("mongoose");

const subSectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  timeDuration: {
    type: String,
  },
  description: {
    type: String,
  },
  videoUrl: {
    type: String,
  },
});

// Check if the model already exists before creating it
module.exports = mongoose.models.SubSection || mongoose.model("SubSection", subSectionSchema);
