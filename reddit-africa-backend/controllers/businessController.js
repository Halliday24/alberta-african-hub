// controllers/businessController.js
const Business = require("../models/Business"); // Import Business model 
const validator = require("validator"); // Import validator library for input validation

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
    } = req.body; // Destructure request body

    // Validation in server-side
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

    // populate automatically replace references in a document with the 
    // actual referenced documents(e.g. replace user ID with user object) from another collection.
    // This will replace the owner ID with the owner's username
    await business.populate('owner', 'username');

    res.status(201).json({
      message: "Business created successfully",
      business
    });

  } catch (error) { 
    // If business creation fails, handle errors
    // Log error to console and return server error response
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
  // req.query is an object containing the query strings from the request URL
  // e.g., /api/businesses?page=1&limit=10&category=restaurant&search=pizza&owner=12345&sort=name
  try {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      owner,
      sort = 'name' // default sort by name
    } = req.query;

    // Build query from query string parameters
    const query = {};

    // validate parameters
    if (category && category !== 'all') {
      query.category = category;
    }

    if (owner) {
      query.owner = owner;
    }

    // extract search term
    // if search is provided, we will search in name, description, and category fields
    // $or operator will match any document that contains the search term in any of the fields
    // $options: 'i' is used to perform a case-insensitive search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort query from different sort options
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
    // pagination is a common pattern in APIs to limit the number of results returned in a single request
    const businesses = await Business.find(query) // find all businesses that match the query
      .populate('owner', 'username') // populate owner details
      .sort(sortQuery) // sort by sortQuery
      .limit(parseInt(limit)) // limit to limit number of results per page
      .skip((parseInt(page) - 1) * parseInt(limit)); // .skip(0 * 10) for page 1, .skip(1 * 10) for page 2, etc.
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