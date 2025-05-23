const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile
} = require("../controllers/userController");

// POST /api/users/register
router.post("/register", registerUser);

// POST /api/users/login
router.post("/login", loginUser);

// GET /api/users/:id
router.get("/:id", getUserProfile);

module.exports = router;
