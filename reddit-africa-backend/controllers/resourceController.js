const Resource = require("../models/Resource");

// @desc    Create a new resource (church or grocery store)
// @route   POST /api/resources
const createResource = async (req, res) => {
  try {
    const { name, type, address, location, hours, description } = req.body;

    const resource = await Resource.create({
      name,
      type,
      address,
      location,
      hours,
      description
    });

    res.status(201).json(resource);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all resources
// @route   GET /api/resources
const getAllResources = async (req, res) => {
  try {
    const resources = await Resource.find().sort({ createdAt: -1 });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get resources by type (church or grocery)
// @route   GET /api/resources/type/:type
const getResourcesByType = async (req, res) => {
  try {
    const type = req.params.type.toLowerCase();
    const resources = await Resource.find({ type });

    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get resource by ID
// @route   GET /api/resources/:id
const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    res.json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a resource
// @route   PUT /api/resources/:id
const updateResource = async (req, res) => {
  try {
    const updated = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({ message: "Resource not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a resource
// @route   DELETE /api/resources/:id
const deleteResource = async (req, res) => {
  try {
    const deleted = await Resource.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Resource not found" });
    }

    res.json({ message: "Resource deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createResource,
  getAllResources,
  getResourcesByType,
  getResourceById,
  updateResource,
  deleteResource
};
