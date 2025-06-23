// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");

// Load environment variables
require("dotenv").config();

const app = express();

// Import middleware
const { optionalAuth } = require("./middleware/auth");

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting - more restrictive for auth endpoints
const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message: {
    error: "Too many requests from this IP, please try again later.",
    retryAfter: Math.ceil((parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000) / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs for auth endpoints
  message: {
    error: "Too many authentication attempts, please try again later.",
    retryAfter: 900
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting
app.use("/api/", generalLimiter);
app.use("/api/users/login", authLimiter);
app.use("/api/users/register", authLimiter);

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.CORS_ORIGIN || "http://localhost:3000",
      "http://localhost:3000", // Always allow localhost for development
      "http://127.0.0.1:3000"
    ];
    
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ 
  limit: "10mb",
  strict: true
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: "10mb" 
}));

// Request logging middleware (development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Database connection with better error handling
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/african-community";
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferMaxEntries: 0, // Disable mongoose buffering
      bufferCommands: false, // Disable mongoose buffering
    };

    const conn = await mongoose.connect(mongoURI, options);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });
    
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/posts", require("./routes/posts"));
app.use("/api/comments", require("./routes/comments"));
app.use("/api/businesses", require("./routes/businesses"));
app.use("/api/resources", require("./routes/resources"));
app.use("/api/events", require("./routes/events")); // New events route

// Health check endpoint with detailed information
app.get("/api/health", (req, res) => {
  const healthCheck = {
    status: "OK",
    message: "African Community API is running!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    version: process.env.npm_package_version || "1.0.0",
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    uptime: process.uptime(),
    memory: process.memoryUsage()
  };
  
  res.json(healthCheck);
});

// API documentation endpoint (basic)
app.get("/api", (req, res) => {
  res.json({
    message: "African Community Platform API",
    version: "1.0.0",
    endpoints: {
      users: "/api/users",
      posts: "/api/posts", 
      comments: "/api/comments",
      businesses: "/api/businesses",
      resources: "/api/resources",
      events: "/api/events",
      health: "/api/health"
    },
    documentation: "See README.md for detailed API documentation"
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', {
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: "Validation Error",
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      message: "Invalid ID format"
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      message: "Duplicate field value entered"
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: "Invalid token"
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: "Token expired"
    });
  }

  // Default error response
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ 
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      "GET /api/health",
      "GET /api",
      "POST /api/users/register",
      "POST /api/users/login",
      "GET /api/events",
      "POST /api/events"
    ]
  });
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully');
  mongoose.connection.close(() => {
    console.log('📊 MongoDB connection closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received, shutting down gracefully');
  mongoose.connection.close(() => {
    console.log('📊 MongoDB connection closed.');
    process.exit(0);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error('❌ Unhandled Promise Rejection:', err.message);
  mongoose.connection.close(() => {
    process.exit(1);
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend should connect to: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔗 API Documentation: http://localhost:${PORT}/api`);
  console.log(`❤️ Health Check: http://localhost:${PORT}/api/health`);
});

// Handle server errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
    process.exit(1);
  } else {
    console.error('❌ Server error:', err);
  }
});

module.exports = app;