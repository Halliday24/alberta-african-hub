// routes/resources.js
const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const {
  createResource,
  getAllResources,
  getResourcesByType,
  getResourceById,
  updateResource,
  deleteResource
} = require("../controllers/resourceController");

// @route   GET /api/resources
// @desc    Get all resources
// @access  Public
router.get("/", getAllResources);

// @route   POST /api/resources
// @desc    Create a new resource
// @access  Private (admin only - could be enhanced with admin middleware)
router.post("/", auth, createResource);

// @route   GET /api/resources/type/:type
// @desc    Get resources by type (church, grocery)
// @access  Public
router.get("/type/:type", getResourcesByType);

// @route   GET /api/resources/:id
// @desc    Get resource by ID
// @access  Public
router.get("/:id", getResourceById);

// @route   PUT /api/resources/:id
// @desc    Update resource (admin only)
// @access  Private
router.put("/:id", auth, updateResource);

// @route   DELETE /api/resources/:id
// @desc    Delete resource (admin only)
// @access  Private
router.delete("/:id", auth, deleteResource);

// @route   POST /api/resources/:id/review
// @desc    Add a review to a resource
// @access  Private
router.post("/:id/review", auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const resourceId = req.params.id;
    const userId = req.user._id;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ 
        message: "Rating must be between 1 and 5" 
      });
    }

    const Resource = require("../models/Resource");
    const resource = await Resource.findById(resourceId);

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    // Check if user already reviewed this resource
    const existingReview = resource.reviews.find(
      review => review.user.toString() === userId.toString()
    );

    if (existingReview) {
      return res.status(400).json({ 
        message: "You have already reviewed this resource" 
      });
    }

    // Add review
    resource.reviews.push({
      user: userId,
      rating,
      comment: comment || ""
    });

    await resource.save();

    // Populate the new review with user info
    await resource.populate('reviews.user', 'username');

    res.status(201).json({
      message: "Review added successfully",
      resource
    });

  } catch (error) {
    console.error("Add resource review error:", error);
    res.status(500).json({ message: "Server error adding review" });
  }
});

module.exports = router;