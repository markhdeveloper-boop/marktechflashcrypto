require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

// ================= EMAIL SETUP =================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ================= FAKE USER STORAGE =================
const users = [];

// ================= REGISTER =================
app.post("/register", (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ msg: "All fields required" });
  }

  users.push({ username, email, password });

  res.json({ msg: "Registered successfully" });
});

// ================= LOGIN (DEFAULT ADMIN INCLUDED) =================
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // 👉 DEFAULT LOGIN (WORKS ALWAYS)
  if (email === "admin@gmail.com" && password === "123456") {
    return res.json({
      msg: "Login successful",
      user: { email: "admin@gmail.com" }
    });
  }

  // 👉 CHECK REGISTERED USERS
  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ msg: "Invalid credentials" });
  }

  res.json({ msg: "Login successful", user });
});

// ================= SEND EMAIL =================
app.post("/send-email", async (req, res) => {
  const { to, subject, text } = req.body;

  if (!to) {
    return res.status(400).json({ msg: "Recipient email required" });
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    });

    res.json({ msg: "Email sent successfully" });
  } catch (err) {
    console.log("EMAIL ERROR:", err);
    res.status(500).json({ msg: "Email failed" });
  }
});

// ================= START SERVER =================
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});