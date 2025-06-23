// controllers/commentController.js
const Comment = require("../models/Comment");
const Post = require("../models/Post");

// @desc    Create a new comment
// @route   POST /api/comments
// @access  Private
const createComment = async (req, res) => {
  try {
    const { postId, content } = req.body;

    // Validation
    if (!postId || !content) {
      return res.status(400).json({
        message: "Please provide postId and content"
      });
    }

    if (content.trim().length === 0) {
      return res.status(400).json({
        message: "Comment content cannot be empty"
      });
    }

    if (content.length > 1000) {
      return res.status(400).json({
        message: "Comment cannot exceed 1000 characters"
      });
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    // Create comment
    const comment = await Comment.create({
      postId,
      user: req.user._id,
      content: content.trim()
    });

    // Populate user details
    await comment.populate('user', 'username');

    res.status(201).json({
      message: "Comment created successfully",
      comment
    });

  } catch (error) {
    console.error("Create comment error:", error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: "Validation error",
        errors
      });
    }
    
    res.status(500).json({
      message: "Server error creating comment"
    });
  }
};

// @desc    Get all comments for a specific post
// @route   GET /api/comments/post/:postId
// @access  Public
const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { page = 1, limit = 20, sort = 'createdAt' } = req.query;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    // Build sort query
    let sortQuery = {};
    switch (sort) {
      case 'createdAt':
        sortQuery = { createdAt: 1 }; // Oldest first
        break;
      case '-createdAt':
        sortQuery = { createdAt: -1 }; // Newest first
        break;
      default:
        sortQuery = { createdAt: 1 };
    }

    // Get comments with pagination
    const comments = await Comment.find({ postId })
      .populate('user', 'username')
      .sort(sortQuery)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const totalComments = await Comment.countDocuments({ postId });

    res.json({
      comments,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalComments / parseInt(limit)),
        totalComments,
        hasNext: parseInt(page) < Math.ceil(totalComments / parseInt(limit)),
        hasPrev: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error("Get comments error:", error);
    res.status(500).json({
      message: "Server error fetching comments"
    });
  }
};

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private (author only)
const updateComment = async (req, res) => {
  try {
    const { content } = req.body;

    // Validation
    if (!content) {
      return res.status(400).json({
        message: "Please provide content"
      });
    }

    if (content.trim().length === 0) {
      return res.status(400).json({
        message: "Comment content cannot be empty"
      });
    }

    if (content.length > 1000) {
      return res.status(400).json({
        message: "Comment cannot exceed 1000 characters"
      });
    }

    // Find comment
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({
        message: "Comment not found"
      });
    }

    // Check if user is the author
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to update this comment"
      });
    }

    // Update comment
    comment.content = content.trim();
    await comment.save();

    // Populate user details
    await comment.populate('user', 'username');

    res.json({
      message: "Comment updated successfully",
      comment
    });

  } catch (error) {
    console.error("Update comment error:", error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: "Validation error",
        errors
      });
    }
    
    res.status(500).json({
      message: "Server error updating comment"
    });
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private (author only)
const deleteComment = async (req, res) => {
  try {
    // Find comment
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({
        message: "Comment not found"
      });
    }

    // Check if user is the author
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to delete this comment"
      });
    }

    // Delete comment
    await Comment.findByIdAndDelete(req.params.id);

    res.json({
      message: "Comment deleted successfully"
    });

  } catch (error) {
    console.error("Delete comment error:", error);
    res.status(500).json({
      message: "Server error deleting comment"
    });
  }
};

// @desc    Get comment by ID
// @route   GET /api/comments/:id
// @access  Public
const getCommentById = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id)
      .populate('user', 'username')
      .populate('postId', 'title');

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found"
      });
    }

    res.json({ comment });

  } catch (error) {
    console.error("Get comment by ID error:", error);
    res.status(500).json({
      message: "Server error fetching comment"
    });
  }
};

module.exports = {
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
  getCommentById
};