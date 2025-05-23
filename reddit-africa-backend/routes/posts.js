const express = require("express");
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost
} = require("../controllers/postController");

// GET /api/posts - list all posts
router.get("/", getAllPosts);

// GET /api/posts/:id - get one post
router.get("/:id", getPostById);

// POST /api/posts - create new post
router.post("/", createPost);

// PUT /api/posts/:id - update post
router.put("/:id", updatePost);

// DELETE /api/posts/:id - delete post
router.delete("/:id", deletePost);

module.exports = router;
