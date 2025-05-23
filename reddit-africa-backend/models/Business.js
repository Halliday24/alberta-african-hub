const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  description: { type: String },
  contactEmail: { type: String },
  phone: { type: String },
  address: { type: String },
  category: { type: String }, // e.g., restaurant, salon, etc.
  reviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Business", businessSchema);
