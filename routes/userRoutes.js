const express = require("express");

const getAllUsers = (req, res) => {
  res.status(500).json({
    stsatus: "error",
    message: "This is not yet defined",
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    stsatus: "error",
    message: "This is not yet defined",
  });
};

const router = express.Router();

router.route("/").get(getAllUsers).post(createUser);

module.exports = router;
