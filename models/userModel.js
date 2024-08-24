const { Schema, model } = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

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
      validate: {
        // works only on SAVE nad CREATE
        validator: function (curElement) {
          return curElement === this.password;
        },
        message: "passwords are not the same",
      },
    },
    photo: { type: String },
  },
  { timestamps: true }
);

// encrypt password... we use mongoose middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  // encrypt the password wit cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

// create the user model
const User = model("User", userSchema);

module.exports = User;
