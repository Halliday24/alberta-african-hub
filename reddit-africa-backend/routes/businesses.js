const express = require("express");
const router = express.Router();
const {
  createBusiness,
  getAllBusinesses,
  getBusinessById,
  updateBusiness,
  deleteBusiness
} = require("../controllers/businessController");

// POST /api/businesses - create new business
router.post("/", createBusiness);

// GET /api/businesses - list all businesses
router.get("/", getAllBusinesses);

// GET /api/businesses/:id - get business by ID
router.get("/:id", getBusinessById);

// PUT /api/businesses/:id - update business
router.put("/:id", updateBusiness);

// DELETE /api/businesses/:id - delete business
router.delete("/:id", deleteBusiness);

module.exports = router;
