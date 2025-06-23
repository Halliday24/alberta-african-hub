// models/Event.js
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  
  description: { 
    type: String, 
    required: [true, 'Event description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  
  date: { 
    type: Date, 
    required: [true, 'Event date is required'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Event date must be in the future'
    }
  },
  
  endDate: {
    type: Date,
    validate: {
      validator: function(value) {
        return !value || value > this.date;
      },
      message: 'End date must be after start date'
    }
  },
  
  location: {
    address: { 
      type: String, 
      required: [true, 'Event location is required'],
      trim: true 
    },
    venue: { 
      type: String, 
      trim: true 
    },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  
  organizer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: [true, 'Event organizer is required']
  },
  
  category: { 
    type: String, 
    enum: {
      values: ['cultural', 'business', 'social', 'educational', 'religious', 'sports', 'community', 'other'],
      message: 'Invalid event category'
    },
    default: 'community'
  },
  
  attendees: [{
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    },
    status: {
      type: String,
      enum: ['attending', 'maybe', 'not_attending'],
      default: 'attending'
    },
    rsvpDate: {
      type: Date,
      default: Date.now
    }
  }],
  
  maxAttendees: {
    type: Number,
    min: [1, 'Maximum attendees must be at least 1'],
    max: [10000, 'Maximum attendees cannot exceed 10,000']
  },
  
  isPublic: { 
    type: Boolean, 
    default: true 
  },
  
  isFree: {
    type: Boolean,
    default: true
  },
  
  price: {
    amount: {
      type: Number,
      min: [0, 'Price cannot be negative']
    },
    currency: {
      type: String,
      default: 'CAD',
      enum: ['CAD', 'USD']
    }
  },
  
  contactInfo: {
    email: {
      type: String,
      validate: {
        validator: function(email) {
          return !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        message: 'Invalid email format'
      }
    },
    phone: {
      type: String,
      validate: {
        validator: function(phone) {
          return !phone || /^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/[\s\-\(\)]/g, ''));
        },
        message: 'Invalid phone number format'
      }
    },
    website: String
  },
  
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  
  images: [{
    url: String,
    caption: String,
    isMain: { type: Boolean, default: false }
  }],
  
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'completed'],
    default: 'published'
  },
  
  requirements: {
    ageRestriction: {
      type: String,
      enum: ['none', '18+', '21+', 'family_friendly']
    },
    dresscode: String,
    other: String
  },
  
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Update the updatedAt field before saving
eventSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for attendee count
eventSchema.virtual('attendeeCount').get(function() {
  return this.attendees ? this.attendees.filter(a => a.status === 'attending').length : 0;
});

// Virtual for checking if event is full
eventSchema.virtual('isFull').get(function() {
  if (!this.maxAttendees) return false;
  return this.attendeeCount >= this.maxAttendees;
});

// Virtual for checking if event is past
eventSchema.virtual('isPast').get(function() {
  return this.date < new Date();
});

// Virtual for checking if event is upcoming (within next 7 days)
eventSchema.virtual('isUpcoming').get(function() {
  const now = new Date();
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  return this.date >= now && this.date <= sevenDaysFromNow;
});

// Index for efficient queries
eventSchema.index({ date: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ organizer: 1 });
eventSchema.index({ 'location.address': 'text', title: 'text', description: 'text' });
eventSchema.index({ isPublic: 1, status: 1 });

// Ensure virtuals are included in JSON output
eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model("Event", eventSchema);