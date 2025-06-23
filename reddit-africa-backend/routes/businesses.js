// routes/businesses.js
const express = require("express");
const router = express.Router();
const { auth, optionalAuth } = require("../middleware/auth");
const {
  createBusiness,
  getAllBusinesses,
  getBusinessById,
  updateBusiness,
  deleteBusiness
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
router.post("/:id/review", auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const businessId = req.params.id;
    const userId = req.user._id;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ 
        message: "Rating must be between 1 and 5" 
      });
    }

    const Business = require("../models/Business");
    const business = await Business.findById(businessId);

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    // Check if user already reviewed this business
    const existingReview = business.reviews.find(
      review => review.user.toString() === userId.toString()
    );

    if (existingReview) {
      return res.status(400).json({ 
        message: "You have already reviewed this business" 
      });
    }

    // Add review
    business.reviews.push({
      user: userId,
      rating,
      comment: comment || ""
    });

    await business.save();

    // Populate the new review with user info
    await business.populate('reviews.user', 'username');

    res.status(201).json({
      message: "Review added successfully",
      business
    });

  } catch (error) {
    console.error("Add review error:", error);
    res.status(500).json({ message: "Server error adding review" });
  }
});

// @route   GET /api/businesses/my/listings
// @desc    Get current user's business listings
// @access  Private
router.get("/my/listings", auth, async (req, res) => {
  try {
    const Business = require("../models/Business");
    const businesses = await Business.find({ owner: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ businesses });

  } catch (error) {
    console.error("Get my businesses error:", error);
    res.status(500).json({ message: "Server error fetching businesses" });
  }
});

module.exports = router;