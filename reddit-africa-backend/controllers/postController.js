// controllers/postController.js
const Post = require("../models/Post");

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    // Validation
    if (!title || !content) {
      return res.status(400).json({
        message: "Please provide title and content"
      });
    }

    if (title.trim().length === 0 || content.trim().length === 0) {
      return res.status(400).json({
        message: "Title and content cannot be empty"
      });
    }

    if (title.length > 100) {
      return res.status(400).json({
        message: "Title cannot exceed 100 characters"
      });
    }

    if (content.length > 5000) {
      return res.status(400).json({
        message: "Content cannot exceed 5000 characters"
      });
    }

    // Validate category
    const validCategories = ['newcomers', 'events', 'general'];
    if (category && !validCategories.includes(category)) {
      return res.status(400).json({
        message: "Invalid category. Must be: newcomers, events, or general"
      });
    }

    // Create post with authenticated user
    const post = await Post.create({
      title: title.trim(),
      content: content.trim(),
      category: category || 'general',
      user: req.user._id
    });

    // Populate user details
    await post.populate('user', 'username');

    res.status(201).json({
      message: "Post created successfully",
      post
    });

  } catch (error) {
    console.error("Create post error:", error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: "Validation error",
        errors
      });
    }
    
    res.status(500).json({
      message: "Server error creating post"
    });
  }
};

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public (with optional user context)
const getAllPosts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      author,
      sort = '-createdAt'
    } = req.query;

    // Build query
    const query = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (author) {
      query.user = author;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort query
    let sortQuery = {};
    switch (sort) {
      case 'createdAt':
        sortQuery = { createdAt: 1 };
        break;
      case '-createdAt':
        sortQuery = { createdAt: -1 };
        break;
      case 'upvotes':
        sortQuery = { upvotes: 1 };
        break;
      case '-upvotes':
        sortQuery = { upvotes: -1 };
        break;
      case 'title':
        sortQuery = { title: 1 };
        break;
      default:
        sortQuery = { createdAt: -1 };
    }

    // Execute query with pagination
    const posts = await Post.find(query)
      .populate('user', 'username')
      .sort(sortQuery)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const totalPosts = await Post.countDocuments(query);

    res.json({
      posts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalPosts / parseInt(limit)),
        totalPosts,
        hasNext: parseInt(page) < Math.ceil(totalPosts / parseInt(limit)),
        hasPrev: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error("Get posts error:", error);
    res.status(500).json({
      message: "Server error fetching posts"
    });
  }
};

// @desc    Get a post by ID
// @route   GET /api/posts/:id
// @access  Public (with optional user context)
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', 'username');

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    res.json({ post });

  } catch (error) {
    console.error("Get post by ID error:", error);
    res.status(500).json({
      message: "Server error fetching post"
    });
  }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private (author only)
const updatePost = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    // Find post
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    // Check if user is the author
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to update this post"
      });
    }

    // Validation
    if (title !== undefined) {
      if (title.trim().length === 0) {
        return res.status(400).json({
          message: "Title cannot be empty"
        });
      }
      if (title.length > 100) {
        return res.status(400).json({
          message: "Title cannot exceed 100 characters"
        });
      }
      post.title = title.trim();
    }

    if (content !== undefined) {
      if (content.trim().length === 0) {
        return res.status(400).json({
          message: "Content cannot be empty"
        });
      }
      if (content.length > 5000) {
        return res.status(400).json({
          message: "Content cannot exceed 5000 characters"
        });
      }
      post.content = content.trim();
    }

    if (category !== undefined) {
      const validCategories = ['newcomers', 'events', 'general'];
      if (!validCategories.includes(category)) {
        return res.status(400).json({
          message: "Invalid category. Must be: newcomers, events, or general"
        });
      }
      post.category = category;
    }

    // Save updated post
    await post.save();

    // Populate user details
    await post.populate('user', 'username');

    res.json({
      message: "Post updated successfully",
      post
    });

  } catch (error) {
    console.error("Update post error:", error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: "Validation error",
        errors
      });
    }
    
    res.status(500).json({
      message: "Server error updating post"
    });
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private (author only)
const deletePost = async (req, res) => {
  try {
    // Find post
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    // Check if user is the author
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to delete this post"
      });
    }

    // Delete the post
    await Post.findByIdAndDelete(req.params.id);

    // Also delete associated comments
    const Comment = require("../models/Comment");
    await Comment.deleteMany({ postId: req.params.id });

    res.json({
      message: "Post and associated comments deleted successfully"
    });

  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({
      message: "Server error deleting post"
    });
  }
};

const voteOnPost = async (req, res) => {
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
}

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  voteOnPost
};