// controllers/eventController.js
const Event = require("../models/Event");
const User = require("../models/User");

// @desc    Create a new event
// @route   POST /api/events
// @access  Private
const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      endDate,
      location,
      category,
      maxAttendees,
      isPublic,
      isFree,
      price,
      contactInfo,
      tags,
      requirements
    } = req.body;

    // Validate required fields
    if (!title || !description || !date || !location?.address) {
      return res.status(400).json({
        message: "Please provide title, description, date, and location address"
      });
    }

    // Validate date is in the future
    if (new Date(date) <= new Date()) {
      return res.status(400).json({
        message: "Event date must be in the future"
      });
    }

    // Create event
    const event = await Event.create({
      title,
      description,
      date,
      endDate,
      location,
      organizer: req.user._id,
      category,
      maxAttendees,
      isPublic,
      isFree,
      price,
      contactInfo,
      tags,
      requirements
    });

    // Populate organizer details
    await event.populate('organizer', 'username email');

    res.status(201).json({
      message: "Event created successfully",
      event
    });

  } catch (error) {
    console.error("Create event error:", error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: "Validation error",
        errors
      });
    }
    
    res.status(500).json({
      message: "Server error creating event"
    });
  }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getAllEvents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      upcoming,
      search,
      organizer,
      sort = 'date'
    } = req.query;

    // Build query
    const query = { isPublic: true, status: 'published' };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (upcoming === 'true') {
      query.date = { $gte: new Date() };
    }

    if (organizer) {
      query.organizer = organizer;
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Build sort
    let sortQuery = {};
    switch (sort) {
      case 'date':
        sortQuery = { date: 1 };
        break;
      case '-date':
        sortQuery = { date: -1 };
        break;
      case 'created':
        sortQuery = { createdAt: -1 };
        break;
      case 'title':
        sortQuery = { title: 1 };
        break;
      default:
        sortQuery = { date: 1 };
    }

    // Execute query with pagination
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sortQuery,
      populate: [
        {
          path: 'organizer',
          select: 'username'
        }
      ]
    };

    const events = await Event.find(query)
      .populate(options.populate)
      .sort(options.sort)
      .limit(options.limit * 1)
      .skip((options.page - 1) * options.limit);

    const total = await Event.countDocuments(query);

    res.json({
      events,
      pagination: {
        currentPage: options.page,
        totalPages: Math.ceil(total / options.limit),
        totalEvents: total,
        hasNext: options.page < Math.ceil(total / options.limit),
        hasPrev: options.page > 1
      }
    });

  } catch (error) {
    console.error("Get events error:", error);
    res.status(500).json({
      message: "Server error fetching events"
    });
  }
};

// @desc    Get event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'username email')
      .populate('attendees.user', 'username');

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    // Check if event is public or user is organizer
    if (!event.isPublic && (!req.user || event.organizer._id.toString() !== req.user._id.toString())) {
      return res.status(403).json({
        message: "Access denied to private event"
      });
    }

    res.json({ event });

  } catch (error) {
    console.error("Get event by ID error:", error);
    res.status(500).json({
      message: "Server error fetching event"
    });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (organizer only)
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    // Check if user is the organizer
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to update this event"
      });
    }

    // Update event
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('organizer', 'username email');

    res.json({
      message: "Event updated successfully",
      event: updatedEvent
    });

  } catch (error) {
    console.error("Update event error:", error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: "Validation error",
        errors
      });
    }
    
    res.status(500).json({
      message: "Server error updating event"
    });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (organizer only)
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    // Check if user is the organizer
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to delete this event"
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({
      message: "Event deleted successfully"
    });

  } catch (error) {
    console.error("Delete event error:", error);
    res.status(500).json({
      message: "Server error deleting event"
    });
  }
};

// @desc    RSVP to event
// @route   POST /api/events/:id/rsvp
// @access  Private
const rsvpToEvent = async (req, res) => {
  try {
    const { status = 'attending' } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    // Check if event is public or user has access
    if (!event.isPublic) {
      return res.status(403).json({
        message: "Cannot RSVP to private event"
      });
    }

    // Check if event is full
    if (event.isFull && status === 'attending') {
      return res.status(400).json({
        message: "Event is full"
      });
    }

    // Check if user already RSVP'd
    const existingRsvp = event.attendees.find(
      attendee => attendee.user.toString() === req.user._id.toString()
    );

    if (existingRsvp) {
      // Update existing RSVP
      existingRsvp.status = status;
      existingRsvp.rsvpDate = new Date();
    } else {
      // Add new RSVP
      event.attendees.push({
        user: req.user._id,
        status,
        rsvpDate: new Date()
      });
    }

    await event.save();

    res.json({
      message: `RSVP updated to ${status}`,
      attendeeCount: event.attendeeCount
    });

  } catch (error) {
    console.error("RSVP error:", error);
    res.status(500).json({
      message: "Server error processing RSVP"
    });
  }
};

// @desc    Get user's events (organized)
// @route   GET /api/events/my/organized
// @access  Private
const getMyOrganizedEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user._id })
      .sort({ date: 1 })
      .populate('organizer', 'username');

    res.json({ events });

  } catch (error) {
    console.error("Get organized events error:", error);
    res.status(500).json({
      message: "Server error fetching organized events"
    });
  }
};

// @desc    Get user's RSVP'd events
// @route   GET /api/events/my/attending
// @access  Private
const getMyAttendingEvents = async (req, res) => {
  try {
    const events = await Event.find({
      'attendees.user': req.user._id,
      'attendees.status': 'attending'
    })
      .sort({ date: 1 })
      .populate('organizer', 'username');

    res.json({ events });

  } catch (error) {
    console.error("Get attending events error:", error);
    res.status(500).json({
      message: "Server error fetching attending events"
    });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  rsvpToEvent,
  getMyOrganizedEvents,
  getMyAttendingEvents
};