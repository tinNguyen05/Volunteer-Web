require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const connectDB = require("./src/config/db");
const passport = require("./src/config/passport");

const authRoutes = require("./src/api/authRoutes");
const eventRoutes = require("./src/api/eventRoutes");
const bloodDonationRoutes = require("./src/api/bloodDonationRoutes");
const membershipRoutes = require("./src/api/membershipRoutes");
const oauthRoutes = require("./src/api/oauthRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware cho Passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/auth", oauthRoutes); // OAuth routes
app.use("/api/events", eventRoutes);
app.use("/api/blood-donation", bloodDonationRoutes);
app.use("/api/membership", membershipRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running", timestamp: new Date() });
});

app.get("/", (req, res) => {
  res.json({
    message: "VolunteerHub Backend API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      events: "/api/events",
      bloodDonation: "/api/blood-donation",
      membership: "/api/membership",
    },
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found", toastType: "error" });
});

app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    toastType: "error",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;