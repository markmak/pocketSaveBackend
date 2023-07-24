const mongoose = require("mongoose");

const SavingSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, "Please provide a date."],
  },
  amount: {
    type: Number,
    required: [true, "Please provide an amount."],
    min: [0, "Amount connot be less than 0."],
  },
});

const TargetSchema = new mongoose.Schema({
  img: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    required: [true, "Please provide a name."],
    minlength: [3, "Name must be at least 3 characters long."],
    maxlength: [29, "Name must be less than 30 characters."],
  },
  status: {
    type: String,
    enum: {
      values: ["on going", "success", "abandon"],
      message: "Invalid status value",
    },
    required: [true, "Please provide a status."],
  },
  amount: {
    type: Number,
    required: [true, "Please provide an amount."],
    min: [1, "Amount connot be less than 1."],
  },
  createdAt: {
    type: Date,
    required: [true, "Please provide a created date."],
  },
  completedDate: {
    type: Date,
    default: "",
  },
  targetSavingPeriod: {
    type: Number,
    required: [true, "Please provide a Target Saving Period."],
    validate: {
      validator: Number.isInteger,
      message: "Target Saving Period must be an integer.",
    },
    min: [1, "Target Saving Period cannot be less than 1."],
  },
  comment: {
    type: String,
    maxlength: [400, "Comment must be less than 400 characters."],
  },
  savingRecord: { type: [SavingSchema], default: [] },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide User ID."],
  },
});

TargetSchema.pre("save", function () {
  this.savingRecord = this.savingRecord.sort((a, b) => {
    const aTime = new Date(a.date).getTime();
    const bTime = new Date(b.date).getTime();
    return bTime - aTime;
  });
});

module.exports = mongoose.model("Target", TargetSchema);
