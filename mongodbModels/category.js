const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  screenType: {
    type: String,
    required: true,
  },
  hasDuration: {
    type: Boolean,
    required: true,
  },
  backgroundImage: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Category", categorySchema);
