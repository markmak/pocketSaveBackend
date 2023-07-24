const mongoose = require("mongoose");

const RecordSchema = new mongoose.Schema({
  recordType: {
    type: String,
    required: [true, "Please provide a recordType."],
    enum: {
      values: ["income", "expense"],
      message: "Invalid record type value.",
    },
  },
  date: {
    type: Date,
    required: [true, "Please provide a date."],
  },
  name: {
    type: String,
    required: [true, "Please provide a name."],
    minlength: [3, "Name must be at least 3 characters long."],
    maxlength: [29, "Name must be less than 30 characters."],
  },
  type: {
    type: String,
    required: [true, "Please provide a type."],
    enum: {
      values: [
        "bills",
        "entertainment",
        "food",
        "investment",
        "rent",
        "tax",
        "travel",
        "others",
        "full time salary",
        "investment income",
        "part time salary",
      ],
      message: "Invalid type value.",
    },
  },
  amount: {
    type: Number,
    required: [true, "Please provide an amount."],
    min: [0, "Amount cannot be less than 0."],
  },
  comment: {
    type: String,
    maxlength: [400, "Comment must be less than 400 characters."],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide User ID."],
  },
});

module.exports = mongoose.model("Record", RecordSchema);
