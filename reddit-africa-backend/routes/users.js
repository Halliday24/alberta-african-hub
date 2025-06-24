// routes/users.js
const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const {
  registerUser,
  loginUser,
  getUserProfile,
  getUserById,
  updateUserProfile
} = require("../controllers/userController");

// @route   POST /api/users/register
// @desc    Register new user
// @access  Public
router.post("/register", registerUser);

// @route   POST /api/users/login  
// @desc    Login user
// @access  Public
router.post("/login", loginUser);

// @route   GET /api/users/profile
// @desc    Get current user's profile
// @access  Private
// it's protected by the auth middleware, it must get through the auth middleware to access this route
// This createss a stack of middleware: auth -> getUserProfile
router.get("/profile", auth, getUserProfile);

// @route   PUT /api/users/profile
// @desc    Update current user's profile
// @access  Private
// it's protected by the auth middleware, it must get through the auth middleware to access this route
router.put("/profile", auth, updateUserProfile);

// @route   GET /api/users/:id
// @desc    Get user by ID (public profile)
// @access  Public
router.get("/:id", getUserById);

module.exports = router;