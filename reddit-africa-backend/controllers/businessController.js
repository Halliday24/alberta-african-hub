const Business = require("../models/Business");

// @desc    Create a new business profile
// @route   POST /api/businesses
const createBusiness = async (req, res) => {
  try {
    const { name, owner, description, contactEmail, phone, address, category } = req.body;

    const business = await Business.create({
      name,
      owner,
      description,
      contactEmail,
      phone,
      address,
      category
    });

    res.status(201).json(business);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all businesses
// @route   GET /api/businesses
const getAllBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find().populate("owner", "username").sort({ createdAt: -1 });
    res.json(businesses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a business by ID
// @route   GET /api/businesses/:id
const getBusinessById = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id).populate("owner", "username");

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    res.json(business);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a business
// @route   PUT /api/businesses/:id
const updateBusiness = async (req, res) => {
  try {
    const updated = await Business.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({ message: "Business not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a business
// @route   DELETE /api/businesses/:id
const deleteBusiness = async (req, res) => {
  try {
    const deleted = await Business.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Business not found" });
    }

    res.json({ message: "Business deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBusiness,
  getAllBusinesses,
  getBusinessById,
  updateBusiness,
  deleteBusiness
};
