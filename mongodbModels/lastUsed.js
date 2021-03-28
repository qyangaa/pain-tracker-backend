const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const lastUsedSchema = new Schema({
  options: [
    {
      _id: {
        type: Schema.Types.ObjectId,
        ref: "Option",
      },
      selected: {
        type: Boolean,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("LastUsed", lastUsedSchema);
