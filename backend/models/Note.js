const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rating: { type: Number, required: true },
    review: { type: String },
  },
  { _id: false }
);

const noteSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  year: { type: String },
  section: { type: String },
  faculty: { type: String },
  pdfPath: { type: String, required: true },
  isPaid: { type: Boolean, default: false },
  price: { type: Number, default: 0 },
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  ratings: [ratingSchema],
  avgRating: { type: Number, default: 0 },
  downloads: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Note", noteSchema);
