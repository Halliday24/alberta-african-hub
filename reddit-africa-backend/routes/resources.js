const express = require("express");
const router = express.Router();
const {
  createResource,
  getAllResources,
  getResourcesByType,
  getResourceById,
  updateResource,
  deleteResource
} = require("../controllers/resourceController");

// POST /api/resources
router.post("/", createResource);

// GET /api/resources
router.get("/", getAllResources);

// GET /api/resources/type/:type
router.get("/type/:type", getResourcesByType);

// GET /api/resources/:id
router.get("/:id", getResourceById);

// PUT /api/resources/:id
router.put("/:id", updateResource);

// DELETE /api/resources/:id
router.delete("/:id", deleteResource);

module.exports = router;
