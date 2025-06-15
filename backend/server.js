const express = require("express");
const mysql2 = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { v4: uuidv4 } = require('uuid');
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// db connection
const db = mysql2.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "user_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

db.getConnection((err) => {
  if (err) {
    console.log("Database connection failed", err);
  } else {
    console.log("Connected to MySQL database");
    
    // Create tables if they don't exist
    createTables();
  }
});

// Function to create necessary tables
function createTables() {
  // Create users table if it doesn't exist
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('admin', 'staff', 'client') NOT NULL,
      email VARCHAR(255),
      full_name VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.query(createUsersTable, (err) => {
    if (err) {
      console.error("Error creating users table:", err);
    } else {
      console.log("Users table created successfully");
    }
  });

  // Update users table to include email and full_name for clients
  const alterUsersTable = `
    ALTER TABLE users 
    ADD COLUMN IF NOT EXISTS email VARCHAR(255),
    ADD COLUMN IF NOT EXISTS full_name VARCHAR(255)
  `;
  
  db.query(alterUsersTable, (err) => {
    if (err && !err.message.includes('Duplicate column name')) {
      console.error("Error updating users table:", err);
    } else {
      console.log("Users table updated successfully");
    }
  });

  // Create bookings table
  const createBookingsTable = `
    CREATE TABLE IF NOT EXISTS bookings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      booking_id VARCHAR(36) UNIQUE NOT NULL,
      user_id INT NOT NULL,
      destination VARCHAR(255) NOT NULL,
      travel_date DATE NOT NULL,
      return_date DATE,
      travelers INT NOT NULL,
      accommodation VARCHAR(100),
      special_requests TEXT,
      total_amount DECIMAL(10, 2) NOT NULL,
      payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
      payment_method VARCHAR(50),
      booking_status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `;

  db.query(createBookingsTable, (err) => {
    if (err) {
      console.error("Error creating bookings table:", err);
    } else {
      console.log("Bookings table created successfully");
    }
  });
}

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret_key");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};

//Register
app.post("/register", async (req, res) => {
  const { username, password, role, email, fullName } = req.body;

  console.log("Registration attempt:", { username, role }); // Debug log

  if (!username || !password || !role) {
    return res.status(400).json({ message: "Username, password, and role are required" });
  }

  // For clients, email and fullName are required
  if (role.toLowerCase() === "client" && (!email || !fullName)) {
    return res.status(400).json({ message: "Email and full name are required for client registration" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const checkUserSql = "SELECT * FROM users WHERE username = ?";
    db.query(checkUserSql, [username], (err, results) => {
      if (err) {
        console.error("Database error during user check:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: "User already exists" });
      }

      const insertUserSql = "INSERT INTO users (username, password, role, email, full_name) VALUES (?, ?, ?, ?, ?)";
      db.query(insertUserSql, [username, hashedPassword, role, email || null, fullName || null], (err, result) => {
        if (err) {
          console.error("Database error during user insertion:", err);
          return res.status(500).json({ message: "Registration Failed" });
        }

        console.log("User registered successfully:", { username, role });
        res.status(201).json({ message: "User registered Successfully" });
      });
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Registration Failed" });
  }
});

// Login User
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [username], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || "fallback_secret_key",
      { expiresIn: "1h" }
    );

    console.log("Login response:", { token, username: user.username, role: user.role });

    res.json({
      message: "Login successful",
      token,
      username: user.username,
      role: user.role,
    });
  });
});

// Create booking
app.post("/api/bookings", verifyToken, (req, res) => {
  const {
    destination,
    travelDate,
    returnDate,
    travelers,
    accommodation,
    specialRequests,
    totalAmount,
    paymentMethod
  } = req.body;

  // Validate required fields
  if (!destination || !travelDate || !travelers || !totalAmount) {
    return res.status(400).json({ message: "Missing required booking information" });
  }

  const bookingId = uuidv4();
  const userId = req.user.id;

  const insertBookingSql = `
    INSERT INTO bookings (
      booking_id, user_id, destination, travel_date, return_date, 
      travelers, accommodation, special_requests, total_amount, 
      payment_method, payment_status, booking_status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'completed', 'confirmed')
  `;

  db.query(insertBookingSql, [
    bookingId, userId, destination, travelDate, returnDate || null,
    travelers, accommodation || null, specialRequests || null,
    totalAmount, paymentMethod || 'card'
  ], (err, result) => {
    if (err) {
      console.error("Error creating booking:", err);
      return res.status(500).json({ message: "Failed to create booking" });
    }

    console.log("Booking created successfully:", bookingId);
    res.status(201).json({
      message: "Booking created successfully",
      bookingId: bookingId,
      status: "confirmed"
    });
  });
});

// Get user bookings
app.get("/api/bookings", verifyToken, (req, res) => {
  const userRole = req.user.role;
  let sql, params;

  if (userRole === "admin" || userRole === "staff") {
    sql = `
      SELECT b.booking_id, u.username, b.destination, b.travel_date, b.return_date, b.travelers, 
             b.accommodation, b.total_amount, b.payment_status, b.booking_status, b.created_at
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      ORDER BY b.created_at DESC
    `;
    params = [];
  } else {
    sql = `
      SELECT booking_id, destination, travel_date, return_date, travelers, 
             accommodation, total_amount, payment_status, booking_status, created_at
      FROM bookings 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `;
    params = [req.user.id];
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error fetching bookings:", err);
      return res.status(500).json({ message: "Failed to fetch bookings" });
    }
    console.log("All bookings query results:", results); // Debug log
    res.json(results);
  });
});

// Get booking by ID
app.get("/api/bookings/:bookingId", verifyToken, (req, res) => {
  const { bookingId } = req.params;
  const userRole = req.user.role;
  let sql, params;

  if (userRole === "admin" || userRole === "staff") {
    sql = `
      SELECT b.*, u.username FROM bookings b
      JOIN users u ON b.user_id = u.id
      WHERE b.booking_id = ?
    `;
    params = [bookingId];
  } else {
    sql = `
      SELECT b.*, u.username FROM bookings b
      JOIN users u ON b.user_id = u.id
      WHERE b.booking_id = ? AND b.user_id = ?
    `;
    params = [bookingId, req.user.id];
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error fetching booking:", err);
      return res.status(500).json({ message: "Failed to fetch booking" });
    }
    if (!results || results.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }
    console.log("Booking by ID result:", results[0]); // Debug log
    res.json(results[0]);
  });
});

// Get all users (admin/staff only)
app.get("/api/admin/users", verifyToken, (req, res) => {
  const userRole = req.user.role;
  if (userRole !== "admin" && userRole !== "staff") {
    return res.status(403).json({ message: "Forbidden" });
  }
  const sql = `SELECT id, username, role, email, full_name FROM users ORDER BY created_at DESC`;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ message: "Failed to fetch users" });
    }
    res.json(results);
  });
});

app.listen(5000, () => {
  console.log("Server is running on Port 5000");
});