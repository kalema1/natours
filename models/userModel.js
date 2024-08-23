const { Schema, model } = require("mongoose");
const validator = require("validator");

//create user schema
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please tell us your name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please prvide a password"],
      minLength: 8,
    },
    passwordConfirm: {
      type: String,
      required: [true, " please confirm your password"],
    },
    photo: { type: String },
  },
  { timestamps: true }
);

// create the user model
const User = model("User", userSchema);

module.exports = User;
