// controllers/businessController.js
const Business = require("../models/Business");
const validator = require("validator");

// @desc    Create a new business listing
// @route   POST /api/businesses
// @access  Private
const createBusiness = async (req, res) => {
  try {
    const {
      name,
      description,
      contactEmail,
      phone,
      address,
      category
    } = req.body;

    // Validation
    if (!name || !description) {
      return res.status(400).json({
        message: "Please provide business name and description"
      });
    }

    if (name.trim().length === 0 || description.trim().length === 0) {
      return res.status(400).json({
        message: "Name and description cannot be empty"
      });
    }

    if (name.length > 100) {
      return res.status(400).json({
        message: "Business name cannot exceed 100 characters"
      });
    }

    if (description.length > 2000) {
      return res.status(400).json({
        message: "Description cannot exceed 2000 characters"
      });
    }

    // Validate email if provided
    if (contactEmail && !validator.isEmail(contactEmail)) {
      return res.status(400).json({
        message: "Please provide a valid email address"
      });
    }

    // Validate phone if provided
    if (phone && phone.length > 20) {
      return res.status(400).json({
        message: "Phone number is too long"
      });
    }

    // Check for duplicate business name by same owner
    const existingBusiness = await Business.findOne({
      name: name.trim(),
      owner: req.user._id
    });

    if (existingBusiness) {
      return res.status(400).json({
        message: "You already have a business with this name"
      });
    }

    // Create business
    const business = await Business.create({
      name: name.trim(),
      owner: req.user._id,
      description: description.trim(),
      contactEmail: contactEmail ? contactEmail.toLowerCase() : undefined,
      phone,
      address,
      category
    });

    // Populate owner details
    await business.populate('owner', 'username');

    res.status(201).json({
      message: "Business created successfully",
      business
    });

  } catch (error) {
    console.error("Create business error:", error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: "Validation error",
        errors
      });
    }
    
    res.status(500).json({
      message: "Server error creating business"
    });
  }
};

// @desc    Get all businesses
// @route   GET /api/businesses
// @access  Public
const getAllBusinesses = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      owner,
      sort = 'name'
    } = req.query;

    // Build query
    const query = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (owner) {
      query.owner = owner;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
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
      case 'category':
        sortQuery = { category: 1 };
        break;
      default:
        sortQuery = { name: 1 };
    }

    // Execute query with pagination
    const businesses = await Business.find(query)
      .populate('owner', 'username')
      .sort(sortQuery)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const totalBusinesses = await Business.countDocuments(query);

    res.json({
      businesses,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalBusinesses / parseInt(limit)),
        totalBusinesses,
        hasNext: parseInt(page) < Math.ceil(totalBusinesses / parseInt(limit)),
        hasPrev: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error("Get businesses error:", error);
    res.status(500).json({
      message: "Server error fetching businesses"
    });
  }
};

// @desc    Get business by ID
// @route   GET /api/businesses/:id
// @access  Public
const getBusinessById = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id)
      .populate('owner', 'username')
      .populate('reviews.user', 'username');

    if (!business) {
      return res.status(404).json({
        message: "Business not found"
      });
    }

    res.json({ business });

  } catch (error) {
    console.error("Get business by ID error:", error);
    res.status(500).json({
      message: "Server error fetching business"
    });
  }
};

// @desc    Update business
// @route   PUT /api/businesses/:id
// @access  Private (owner only)
const updateBusiness = async (req, res) => {
  try {
    const {
      name,
      description,
      contactEmail,
      phone,
      address,
      category
    } = req.body;

    // Find business
    const business = await Business.findById(req.params.id);
    if (!business) {
      return res.status(404).json({
        message: "Business not found"
      });
    }

    // Check if user is the owner
    if (business.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to update this business"
      });
    }

    // Validation
    if (name !== undefined) {
      if (name.trim().length === 0) {
        return res.status(400).json({
          message: "Business name cannot be empty"
        });
      }
      if (name.length > 100) {
        return res.status(400).json({
          message: "Business name cannot exceed 100 characters"
        });
      }
      business.name = name.trim();
    }

    if (description !== undefined) {
      if (description.trim().length === 0) {
        return res.status(400).json({
          message: "Description cannot be empty"
        });
      }
      if (description.length > 2000) {
        return res.status(400).json({
          message: "Description cannot exceed 2000 characters"
        });
      }
      business.description = description.trim();
    }

    if (contactEmail !== undefined) {
      if (contactEmail && !validator.isEmail(contactEmail)) {
        return res.status(400).json({
          message: "Please provide a valid email address"
        });
      }
      business.contactEmail = contactEmail ? contactEmail.toLowerCase() : null;
    }

    if (phone !== undefined) {
      if (phone && phone.length > 20) {
        return res.status(400).json({
          message: "Phone number is too long"
        });
      }
      business.phone = phone;
    }

    if (address !== undefined) {
      business.address = address;
    }

    if (category !== undefined) {
      business.category = category;
    }

    // Save updated business
    await business.save();

    // Populate owner details
    await business.populate('owner', 'username');

    res.json({
      message: "Business updated successfully",
      business
    });

  } catch (error) {
    console.error("Update business error:", error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: "Validation error",
        errors
      });
    }
    
    res.status(500).json({
      message: "Server error updating business"
    });
  }
};

// @desc    Delete business
// @route   DELETE /api/businesses/:id
// @access  Private (owner only)
const deleteBusiness = async (req, res) => {
  try {
    // Find business
    const business = await Business.findById(req.params.id);
    if (!business) {
      return res.status(404).json({
        message: "Business not found"
      });
    }

    // Check if user is the owner
    if (business.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to delete this business"
      });
    }

    // Delete business
    await Business.findByIdAndDelete(req.params.id);

    res.json({
      message: "Business deleted successfully"
    });

  } catch (error) {
    console.error("Delete business error:", error);
    res.status(500).json({
      message: "Server error deleting business"
    });
  }
};

module.exports = {
  createBusiness,
  getAllBusinesses,
  getBusinessById,
  updateBusiness,
  deleteBusiness
};