// controllers/userController.js
const User = require("../models/User");
// bcryptjs is the Node.js module that is used to implement the bcrypt hashing algorithm in Node.
const bcrypt = require("bcryptjs");
const { generateToken } = require("../middleware/auth");
const validator = require("validator");

// @desc    Register new user
// @route   POST /api/users/register
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ 
        message: "Please provide username, email, and password" 
      });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ 
        message: "Please provide a valid email address" 
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ 
        message: "Password must be at least 6 characters long" 
      });
    }

    // Validate username length and format
    if (username.length < 3 || username.length > 30) {
      return res.status(400).json({ 
        message: "Username must be between 3 and 30 characters" 
      });
    }

    // Check for existing user by username or email
    const existingUser = await User.findOne({ 
      $or: [
        { username: username.toLowerCase() }, 
        { email: email.toLowerCase() }
      ] 
    });

    if (existingUser) {
      const field = existingUser.email.toLowerCase() === email.toLowerCase() 
        ? 'email' 
        : 'username';
      return res.status(400).json({ 
        message: `User with this ${field} already exists` 
      });
    }

    // Hash password
    // process.env.BCRYPT_SALT_ROUNDS is set in the .env file
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
    const salt = await bcrypt.genSalt(saltRounds); 
    // add a random string to the password to hash more securely
    const passwordHash = await bcrypt.hash(password, salt); 

    // Create new user
    const newUser = await User.create({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      passwordHash
    });

    // Generate JWT token
    const token = generateToken(newUser._id);
    // Return user data (excluding password) and token
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        dateJoined: newUser.dateJoined
      }
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ 
      message: "Server error during registration" 
    });
  }
};

// @desc    Login user
// @route   POST /api/users/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        message: "Please provide email and password" 
      });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ 
        message: "Please provide a valid email address" 
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ 
        message: "Invalid email or password" 
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: "Invalid email or password" 
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Return user data (excluding password) and token
    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        dateJoined: user.dateJoined
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      message: "Server error during login" 
    });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    // req.user is set by auth middleware
    const user = await User.findById(req.user._id).select('-passwordHash');
    
    if (!user) {
      return res.status(404).json({ 
        message: "User not found" 
      });
    }

    res.json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        dateJoined: user.dateJoined
      }
    });

  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ 
      message: "Server error fetching profile" 
    });
  }
};

// @desc    Get user by ID (public profile)
// @route   GET /api/users/:id
// @access  Public
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash -email');

    if (!user) {
      return res.status(404).json({ 
        message: "User not found" 
      });
    }

    res.json({
      user: {
        _id: user._id,
        username: user.username,
        dateJoined: user.dateJoined
      }
    });

  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({ 
      message: "Server error fetching user" 
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const userId = req.user._id;

    // Build update object
    const updateData = {};
    
    if (username !== undefined) {
      if (username.length < 3 || username.length > 30) {
        return res.status(400).json({ 
          message: "Username must be between 3 and 30 characters" 
        });
      }
      updateData.username = username.toLowerCase();
    }

    if (email !== undefined) {
      if (!validator.isEmail(email)) {
        return res.status(400).json({ 
          message: "Please provide a valid email address" 
        });
      }
      updateData.email = email.toLowerCase();
    }

    // Check for existing username/email (excluding current user)
    if (updateData.username || updateData.email) {
      const existingUser = await User.findOne({
        _id: { $ne: userId },
        $or: [
          ...(updateData.username ? [{ username: updateData.username }] : []),
          ...(updateData.email ? [{ email: updateData.email }] : [])
        ]
      });

      if (existingUser) {
        const field = existingUser.email === updateData.email ? 'email' : 'username';
        return res.status(400).json({ 
          message: `User with this ${field} already exists` 
        });
      }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-passwordHash');

    res.json({
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        dateJoined: updatedUser.dateJoined
      }
    });

  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ 
      message: "Server error updating profile" 
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  getUserById,
  updateUserProfile
};