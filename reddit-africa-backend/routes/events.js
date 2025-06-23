// routes/events.js
const express = require("express");
const router = express.Router();
const { auth, optionalAuth } = require("../middleware/auth");
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  rsvpToEvent,
  getMyOrganizedEvents,
  getMyAttendingEvents
} = require("../controllers/eventController");

// @route   GET /api/events
// @desc    Get all public events with filtering and pagination
// @access  Public
router.get("/", getAllEvents);

// @route   POST /api/events
// @desc    Create a new event
// @access  Private
router.post("/", auth, createEvent);

// @route   GET /api/events/my/organized
// @desc    Get events organized by current user
// @access  Private
router.get("/my/organized", auth, getMyOrganizedEvents);

// @route   GET /api/events/my/attending
// @desc    Get events user is attending
// @access  Private
router.get("/my/attending", auth, getMyAttendingEvents);

// @route   GET /api/events/:id
// @desc    Get event by ID
// @access  Public (with optional auth for private events)
router.get("/:id", optionalAuth, getEventById);

// @route   PUT /api/events/:id
// @desc    Update event (organizer only)
// @access  Private
router.put("/:id", auth, updateEvent);

// @route   DELETE /api/events/:id
// @desc    Delete event (organizer only)
// @access  Private
router.delete("/:id", auth, deleteEvent);

// @route   POST /api/events/:id/rsvp
// @desc    RSVP to an event
// @access  Private
router.post("/:id/rsvp", auth, rsvpToEvent);

module.exports = router;