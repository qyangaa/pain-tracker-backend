const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const weatherSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  uid: {
    type: Schema.Types.ObjectId,
    ref: "lastUsed",
  },
  lon: {
    type: Number,
    required: true,
  },
  lat: {
    type: Number,
    required: true,
  },
  main: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  temp: {
    type: Number,
    required: true,
  },
  humidity: {
    type: Number,
    required: true,
  },
  pressure: {
    type: Number,
    required: true,
  },
  clouds: {
    type: Number,
    required: false,
  },
  visibility: {
    type: Number,
    required: true,
  },
  windSpeed: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Weather", weatherSchema);
