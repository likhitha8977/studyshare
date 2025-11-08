const Note = require("../models/Note");
const fs = require("fs");
const path = require("path");

exports.uploadNote = async (req, res) => {
  try {
    const { subject, year, section, faculty, isPaid, price } = req.body;
    if (!req.file)
      return res.status(400).json({ message: "PDF file is required" });

    const pdfPath = `/uploads/${req.file.filename}`;
    const note = new Note({
      subject,
      year,
      section,
      faculty,
      pdfPath,
      isPaid: isPaid === "true" || isPaid === true,
      price: Number(price) || 0,
      uploader: req.user?.id,
    });
    await note.save();
    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to upload note" });
  }
};

exports.listNotes = async (req, res) => {
  try {
    const { q, subject, faculty, page = 1, limit = 12 } = req.query;
    const filter = {};
    if (subject) filter.subject = new RegExp(subject, "i");
    if (faculty) filter.faculty = new RegExp(faculty, "i");
    if (q)
      filter.$or = [
        { subject: new RegExp(q, "i") },
        { faculty: new RegExp(q, "i") },
      ];

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Note.countDocuments(filter);
    const notes = await Note.find(filter)
      .sort({ avgRating: -1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    res.json({ notes, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to list notes" });
  }
};

exports.getNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get note" });
  }
};

exports.rateNote = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    const existing = note.ratings.find(
      (r) => r.user?.toString() === req.user.id
    );
    if (existing) {
      existing.rating = rating;
      existing.review = review;
    } else {
      note.ratings.push({ user: req.user.id, rating, review });
    }

    // recalc avg
    note.avgRating =
      note.ratings.reduce((s, r) => s + r.rating, 0) /
      (note.ratings.length || 1);
    await note.save();
    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to rate note" });
  }
};

// Download note
exports.downloadNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    // For paid notes, you would check if user has paid here
    // if (note.isPaid && !userHasPaid) {
    //   return res.status(403).json({ message: "Payment required" });
    // }

    const filePath = path.join(__dirname, "..", note.pdfPath);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    // Increment download counter
    note.downloads = (note.downloads || 0) + 1;
    await note.save();

    // Send file
    res.download(
      filePath,
      `${note.subject.replace(/\s+/g, "_")}.pdf`,
      (err) => {
        if (err) {
          console.error("Download error:", err);
          if (!res.headersSent) {
            res.status(500).json({ message: "Failed to download file" });
          }
        }
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to download note" });
  }
};

// Optional: delete note and remove uploaded file
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    // remove file
    const filePath = path.join(__dirname, "..", note.pdfPath);
    fs.unlink(filePath, () => {});
    await note.deleteOne();
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete note" });
  }
};
