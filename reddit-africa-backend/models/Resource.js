const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  name: { type: String, required: true },  // e.g., "Grace Church" or "Afro Mart"
  type: { type: String, enum: ["church", "grocery"], required: true },
  address: { type: String, required: true },
  location: {
    lat: { type: Number },
    lng: { type: Number }
  },
  hours: { type: String },
  description: { type: String },
  reviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      comment: { type: String },
      rating: { type: Number, min: 1, max: 5 }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Resource", resourceSchema);
