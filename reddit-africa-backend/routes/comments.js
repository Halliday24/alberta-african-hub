const express = require("express");
const router = express.Router();
const {
  createComment,
  getCommentsByPost,
  deleteComment
} = require("../controllers/commentController");

// POST /api/comments - create a new comment
router.post("/", createComment);

// GET /api/comments/post/:postId - get all comments for a specific post
router.get("/post/:postId", getCommentsByPost);

// DELETE /api/comments/:id - delete a comment
router.delete("/:id", deleteComment);

module.exports = router;
