const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const recordSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  uid: {
    type: Schema.Types.ObjectId,
    ref: "lastUsed",
  },
  optionId: {
    type: Schema.Types.ObjectId,
    ref: "Option",
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "Category",
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

module.exports = mongoose.model("Record", recordSchema);
