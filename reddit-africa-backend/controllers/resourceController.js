// controllers/resourceController.js
const Resource = require("../models/Resource");

// @desc    Create a new resource (church or grocery store)
// @route   POST /api/resources
// @access  Private (authenticated users can contribute resources)
const createResource = async (req, res) => {
  try {
    const { name, type, address, location, hours, description } = req.body;

    // Validation
    if (!name || !type || !address) {
      return res.status(400).json({
        message: "Please provide name, type, and address"
      });
    }

    if (name.trim().length === 0 || address.trim().length === 0) {
      return res.status(400).json({
        message: "Name and address cannot be empty"
      });
    }

    if (name.length > 100) {
      return res.status(400).json({
        message: "Resource name cannot exceed 100 characters"
      });
    }

    // Validate type
    const validTypes = ['church', 'grocery'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        message: "Invalid type. Must be 'church' or 'grocery'"
      });
    }

    if (description && description.length > 1000) {
      return res.status(400).json({
        message: "Description cannot exceed 1000 characters"
      });
    }

    // Validate location coordinates if provided
    if (location) {
      if (location.lat && (location.lat < -90 || location.lat > 90)) {
        return res.status(400).json({
          message: "Invalid latitude. Must be between -90 and 90"
        });
      }
      if (location.lng && (location.lng < -180 || location.lng > 180)) {
        return res.status(400).json({
          message: "Invalid longitude. Must be between -180 and 180"
        });
      }
    }

    // Check for duplicate resource (same name and address)
    const existingResource = await Resource.findOne({
      name: name.trim(),
      address: address.trim()
    });

    if (existingResource) {
      return res.status(400).json({
        message: "A resource with this name and address already exists"
      });
    }

    const resource = await Resource.create({
      name: name.trim(),
      type,
      address: address.trim(),
      location,
      hours,
      description: description ? description.trim() : undefined
    });

    res.status(201).json({
      message: "Resource created successfully",
      resource
    });

  } catch (error) {
    console.error("Create resource error:", error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: "Validation error",
        errors
      });
    }
    
    res.status(500).json({
      message: "Server error creating resource"
    });
  }
};

// @desc    Get all resources
// @route   GET /api/resources
// @access  Public
const getAllResources = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      type,
      search,
      sort = 'name'
    } = req.query;

    // Build query
    const query = {};

    if (type && type !== 'all') {
      query.type = type;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort query
    let sortQuery = {};
    switch (sort) {
      case 'name':
        sortQuery = { name: 1 };
        break;
      case '-name':
        sortQuery = { name: -1 };
        break;
      case 'type':
        sortQuery = { type: 1, name: 1 };
        break;
      case 'createdAt':
        sortQuery = { createdAt: 1 };
        break;
      case '-createdAt':
        sortQuery = { createdAt: -1 };
        break;
      default:
        sortQuery = { name: 1 };
    }

    // Execute query with pagination
    const resources = await Resource.find(query)
      .sort(sortQuery)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const totalResources = await Resource.countDocuments(query);

    res.json({
      resources,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalResources / parseInt(limit)),
        totalResources,
        hasNext: parseInt(page) < Math.ceil(totalResources / parseInt(limit)),
        hasPrev: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error("Get resources error:", error);
    res.status(500).json({
      message: "Server error fetching resources"
    });
  }
};

// @desc    Get resources by type (church or grocery)
// @route   GET /api/resources/type/:type
// @access  Public
const getResourcesByType = async (req, res) => {
  try {
    const type = req.params.type.toLowerCase();
    const { page = 1, limit = 20, search, sort = 'name' } = req.query;

    // Validate type
    const validTypes = ['church', 'grocery'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        message: "Invalid type. Must be 'church' or 'grocery'"
      });
    }

    // Build query
    const query = { type };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort query
    let sortQuery = {};
    switch (sort) {
      case 'name':
        sortQuery = { name: 1 };
        break;
      case '-name':
        sortQuery = { name: -1 };
        break;
      case 'createdAt':
        sortQuery = { createdAt: 1 };
        break;
      case '-createdAt':
        sortQuery = { createdAt: -1 };
        break;
      default:
        sortQuery = { name: 1 };
    }

    const resources = await Resource.find(query)
      .sort(sortQuery)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const totalResources = await Resource.countDocuments(query);

    res.json({
      resources,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalResources / parseInt(limit)),
        totalResources,
        hasNext: parseInt(page) < Math.ceil(totalResources / parseInt(limit)),
        hasPrev: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error("Get resources by type error:", error);
    res.status(500).json({
      message: "Server error fetching resources"
    });
  }
};

// @desc    Get resource by ID
// @route   GET /api/resources/:id
// @access  Public
const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('reviews.user', 'username');

    if (!resource) {
      return res.status(404).json({
        message: "Resource not found"
      });
    }

    res.json({ resource });

  } catch (error) {
    console.error("Get resource by ID error:", error);
    res.status(500).json({
      message: "Server error fetching resource"
    });
  }
};

// @desc    Update a resource
// @route   PUT /api/resources/:id
// @access  Private (admin or contributor)
const updateResource = async (req, res) => {
  try {
    const { name, type, address, location, hours, description } = req.body;

    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({
        message: "Resource not found"
      });
    }

    // Basic validation
    if (name !== undefined) {
      if (name.trim().length === 0) {
        return res.status(400).json({
          message: "Resource name cannot be empty"
        });
      }
      if (name.length > 100) {
        return res.status(400).json({
          message: "Resource name cannot exceed 100 characters"
        });
      }
      resource.name = name.trim();
    }

    if (type !== undefined) {
      const validTypes = ['church', 'grocery'];
      if (!validTypes.includes(type)) {
        return res.status(400).json({
          message: "Invalid type. Must be 'church' or 'grocery'"
        });
      }
      resource.type = type;
    }

    if (address !== undefined) {
      if (address.trim().length === 0) {
        return res.status(400).json({
          message: "Address cannot be empty"
        });
      }
      resource.address = address.trim();
    }

    if (location !== undefined) {
      if (location.lat && (location.lat < -90 || location.lat > 90)) {
        return res.status(400).json({
          message: "Invalid latitude. Must be between -90 and 90"
        });
      }
      if (location.lng && (location.lng < -180 || location.lng > 180)) {
        return res.status(400).json({
          message: "Invalid longitude. Must be between -180 and 180"
        });
      }
      resource.location = location;
    }

    if (hours !== undefined) {
      resource.hours = hours;
    }

    if (description !== undefined) {
      if (description && description.length > 1000) {
        return res.status(400).json({
          message: "Description cannot exceed 1000 characters"
        });
      }
      resource.description = description ? description.trim() : null;
    }

    await resource.save();

    res.json({
      message: "Resource updated successfully",
      resource
    });

  } catch (error) {
    console.error("Update resource error:", error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: "Validation error",
        errors
      });
    }
    
    res.status(500).json({
      message: "Server error updating resource"
    });
  }
};

// @desc    Delete a resource
// @route   DELETE /api/resources/:id
// @access  Private (admin only)
const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        message: "Resource not found"
      });
    }

    await Resource.findByIdAndDelete(req.params.id);

    res.json({
      message: "Resource deleted successfully"
    });

  } catch (error) {
    console.error("Delete resource error:", error);
    res.status(500).json({
      message: "Server error deleting resource"
    });
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