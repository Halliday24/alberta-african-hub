// routes/comments.js
const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");

// Import comment controller functions
// Note: You'll need to create/update these functions in commentController.js
const {
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment
} = require("../controllers/commentController");

// @route   GET /api/comments/post/:postId
// @desc    Get all comments for a specific post
// @access  Public
router.get("/post/:postId", getCommentsByPost);

// @route   POST /api/comments
// @desc    Create a new comment
// @access  Private
router.post("/", auth, createComment);

// @route   PUT /api/comments/:id
// @desc    Update comment (author only)
// @access  Private
router.put("/:id", auth, updateComment);

// @route   DELETE /api/comments/:id
// @desc    Delete comment (author only)
// @access  Private
router.delete("/:id", auth, deleteComment);

module.exports = router;