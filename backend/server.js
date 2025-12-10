const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const notesRoutes = require("./routes/notes");

const app = express();

// Enhanced CORS configuration for production
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://enchanting-strudel-235ce6.netlify.app",
    process.env.FRONTEND_URL,
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Add health check endpoint
app.get("/", (req, res) => {
  res.json({
    message: "ShareNotes API is running!",
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "ShareNotes Backend",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// Static route for uploaded PDFs
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    const mongoUri =
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/sharenotes";

    // MongoDB connection options (simplified for Node.js v22 compatibility)
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Note: SSL/TLS is handled automatically by MongoDB Atlas connection string
    };

    await mongoose.connect(mongoUri, options);
    console.log("✅ Connected to MongoDB Atlas successfully!");
    console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    console.error("\n💡 Troubleshooting tips:");
    console.error("1. Check your MongoDB Atlas connection string in .env");
    console.error(
      "2. Ensure your IP is whitelisted in MongoDB Atlas (0.0.0.0/0 for all IPs)"
    );
    console.error("3. Verify your username and password are correct");
    console.error("4. Check if MongoDB Atlas cluster is running\n");
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("⚠️  Unhandled Promise Rejection:", err.message);
});

start();
