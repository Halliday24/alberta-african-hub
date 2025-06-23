// routes/posts.js
const express = require("express");
const router = express.Router();
const { auth, optionalAuth } = require("../middleware/auth");
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost
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
router.post("/:id/vote", auth, async (req, res) => {
  try {
    const { voteType } = req.body; // 'up' or 'down'
    const postId = req.params.id;
    const userId = req.user._id;

    const Post = require("../models/Post");
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Simple voting implementation - just increment/decrement upvotes
    // In a more complex system, you'd track individual user votes
    if (voteType === 'up') {
      post.upvotes += 1;
    } else if (voteType === 'down') {
      post.upvotes = Math.max(0, post.upvotes - 1); // Don't go below 0
    } else {
      return res.status(400).json({ message: "Invalid vote type" });
    }

    await post.save();

    res.json({
      message: "Vote recorded successfully",
      upvotes: post.upvotes
    });

  } catch (error) {
    console.error("Vote error:", error);
    res.status(500).json({ message: "Server error processing vote" });
  }
});

module.exports = router;