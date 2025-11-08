const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const auth = require("../middleware/auth");
const router = express.Router();
const {
  uploadNote,
  listNotes,
  getNote,
  rateNote,
  downloadNote,
  deleteNote,
} = require("../controllers/noteController");

// ensure uploads dir exists
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const name = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".pdf") return cb(new Error("Only PDFs allowed"));
    cb(null, true);
  },
});

router.post("/upload", auth, upload.single("pdf"), uploadNote);
router.get("/", listNotes);
router.get("/:id", getNote);
router.get("/:id/download", downloadNote);
router.post("/:id/rate", auth, rateNote);
router.delete("/:id", auth, deleteNote);

module.exports = router;
