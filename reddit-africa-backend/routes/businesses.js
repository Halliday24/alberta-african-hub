// routes/businesses.js
const express = require("express");
const router = express.Router();
const { auth, optionalAuth } = require("../middleware/auth");
const {
  createBusiness,
  getAllBusinesses,
  getBusinessById,
  updateBusiness,
  deleteBusiness,
  reviewBusiness,
  getMyListings
} = require("../controllers/businessController");

// @route   GET /api/businesses
// @desc    Get all businesses
// @access  Public
router.get("/", getAllBusinesses);

// @route   POST /api/businesses
// @desc    Create a new business listing
// @access  Private
router.post("/", auth, createBusiness);

// @route   GET /api/businesses/:id
// @desc    Get business by ID
// @access  Public
router.get("/:id", getBusinessById);

// @route   PUT /api/businesses/:id
// @desc    Update business (owner only)
// @access  Private
router.put("/:id", auth, updateBusiness);

// @route   DELETE /api/businesses/:id
// @desc    Delete business (owner only)
// @access  Private
router.delete("/:id", auth, deleteBusiness);

// @route   POST /api/businesses/:id/review
// @desc    Add a review to a business
// @access  Private
router.post("/:id/review", auth, reviewBusiness);

// @route   GET /api/businesses/my/listings
// @desc    Get current user's business listings
// @access  Private
router.get("/my/listings", auth, getMyListings);

module.exports = router;