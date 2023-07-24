const mongoose = require("mongoose");

const TemplateSchema = new mongoose.Schema(
  {
    templateName: {
      type: String,
      required: [true, "Please provide a template name."],
      minlength: [3, "Template name must be at least 3 characters long."],
      maxlength: [29, "Template name must be less than 30 characters"],
    },
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
    },
    name: {
      type: String,
      maxlength: [29, "Name must be less than 30 characters"],
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Template", TemplateSchema);
