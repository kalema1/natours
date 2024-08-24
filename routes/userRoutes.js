const express = require("express");
const { createUser, getAllUsers } = require("../controllers/userControler");
const { signup, login } = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.route("/").get(getAllUsers).post(createUser);

module.exports = router;
