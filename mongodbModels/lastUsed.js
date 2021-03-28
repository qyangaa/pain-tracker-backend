const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const lastUsedSchema = new Schema({
  options: [
    {
      type: Schema.Types.ObjectId,
      ref: "Option",
    },
  ],
});

module.exports = mongoose.model("LastUsed", lastUsedSchema);
