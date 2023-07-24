const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide user name."],
    minlength: [3, "Name must be at least 3 characters long."],
    maxlength: [29, "Name must be less than 30 characters"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email."],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email.",
    },
  },
  password: {
    type: String,
    required: [true, "Please provide an email."],
    minlength: [8, "Password must be at least 8 characters long."],
    maxlength: [29, "Password must be less than 30 characters"],
  },
  img: {
    type: String,
    default: "",
  },
});

UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.pre("findOneAndUpdate", async function () {
  if (!this._update.password) return;
  const salt = await bcrypt.genSalt(10);
  this._update.password = await bcrypt.hash(this._update.password, salt);
});

UserSchema.methods.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
