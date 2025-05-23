const Comment = require("../models/Comment");

// @desc    Create a new comment
// @route   POST /api/comments
const createComment = async (req, res) => {
  try {
    const { postId, user, content } = req.body;

    const comment = await Comment.create({
      postId,
      user,
      content
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all comments for a specific post
// @route   GET /api/comments/post/:postId
const getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .populate("user", "username")
      .sort({ createdAt: 1 }); // oldest to newest

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
const deleteComment = async (req, res) => {
  try {
    const deleted = await Comment.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createComment,
  getCommentsByPost,
  deleteComment
};
