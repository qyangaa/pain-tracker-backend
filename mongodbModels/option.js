const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const optionSchema = new Schema({
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
  text: {
    type: String,
    required: true,
  },
  src: {
    type: String,
    required: false,
  },
  duration: {
    type: Number,
    required: false,
  },
  amount: {
    type: Number,
    required: false,
  },
});

module.exports = mongoose.model("Option", optionSchema);
