const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  //sign in user imediate after sign up
  const token = signToken(newUser._id);

  res.status(201).json({
    status: "success",
    token,
    data: { user: newUser },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // check if email and password exist
  if (!email || !password) {
    throw new Error("Please provide email and password");
  }

  // check if email and password are correct
  const user = await User.findOne({ email }).select("+password");
  const correct = await user.correctPassword(password, user.password);

  if (!user || !correct) {
    throw new Error("Incorect password or email");
  }

  //send token to client
  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // 1) get token and check if token exist
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    //get token
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401).json({
      status: "fail",
      message: "You are not logged in! Please login to get access",
    });
  }

  // 2) verify the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);

  // 3) check if user changed the password aftertoken was issued
  const freshUser = await User.findById(decoded.id);

  if (!freshUser) {
    res.status(401).json({
      status: "fail",
      message: "The user belonging to this token does not exist",
    });
  }

  // check if user change their password after the token was issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    res.status(401).json({
      status: "fail",
      message: "User recently changed password! Please login again",
    });
  }

  //grand access to the protected route
  req.user = freshUser;
  next();
});
