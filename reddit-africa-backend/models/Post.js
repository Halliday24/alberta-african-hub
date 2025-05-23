const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String },
  category: { type: String, enum: ["newcomers", "events", "general"], default: "general" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  upvotes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Post", postSchema);
