// routes/posts.js
const express = require("express");
const router = express.Router();
const { auth, optionalAuth } = require("../middleware/auth");
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  voteOnPost
} = require("../controllers/postController");

// @route   GET /api/posts
// @desc    Get all posts with optional user context
// @access  Public (with optional auth for user-specific data)
router.get("/", optionalAuth, getAllPosts);

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post("/", auth, createPost);

// @route   GET /api/posts/:id
// @desc    Get post by ID
// @access  Public (with optional auth for user-specific data)
router.get("/:id", optionalAuth, getPostById);

// @route   PUT /api/posts/:id
// @desc    Update post (author only)
// @access  Private
router.put("/:id", auth, updatePost);

// @route   DELETE /api/posts/:id
// @desc    Delete post (author only)
// @access  Private
router.delete("/:id", auth, deletePost);

// @route   POST /api/posts/:id/vote
// @desc    Vote on a post (upvote/downvote)
// @access  Private
router.post("/:id/vote", auth, voteOnPost);

module.exports = router;