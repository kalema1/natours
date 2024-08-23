const express = require("express");
const { createUser, getAllUsers } = require("../controllers/userControler");
const { signup } = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signup);

router.route("/").get(getAllUsers).post(createUser);

module.exports = router;
