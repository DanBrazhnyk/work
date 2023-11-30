import express from "express";
import mysql from "mysql";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import crypto from "crypto";
import bcrypt from "bcrypt"; 

dotenv.config();

const router = express.Router();
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password:  process.env.DB_PASSWORD,
  database: process.env.DB_SIGNUP,
});

const smtpTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

router.post('/forgotPassword', async (req, res) => {
  const { user_email } = req.body;

  try {
    if (!user_email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const checkEmailQuery = "SELECT * FROM users WHERE user_email = ?";
    const user = await db.query(checkEmailQuery, [user_email]);

    if (!user || user.length === 0) {
      return res.status(404).json({ error: "Email not found" });
    }

    const resetToken = crypto.randomBytes(5).toString('hex');
    const resetTokenExpiration = Date.now() + 300000; 
    const saveTokenQuery = "UPDATE users SET token = ?, reset_password_expiration = ? WHERE user_email = ?";
    await db.query(saveTokenQuery, [resetToken, resetTokenExpiration, user_email]);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset",
      text: resetToken,
    };

    smtpTransport.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email: ", error);
        return res.status(500).json({ error: "An error occurred while sending the email" });
      }
      console.log("Email sent: ", info.response);
      return res.status(200).json({ message: "Email sent successfully" });
    });
  } catch (error) {
    console.error("Error querying the database: ", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

router.post("/check-token", (req, res) => {
  const { token } = req.body;
  const checkTokenQuery = "SELECT COUNT(*) AS count FROM users WHERE token = ?";

  db.query(checkTokenQuery, [token], (err, results) => {
    if (err) {
      console.error("Error querying the database: ", err);
      res.status(500).json({ error: "An error occurred" });
    } else {
      const count = results[0].count;
      res.status(200).json({ exists: count > 0 });
    }
  });
});

router.post('/resetPassword', async (req, res) => {
  const { user_email, token, newPassword } = req.body;

  try {
    if (!user_email || !token || !newPassword) {
      return res.status(400).json({ error: "Email, token, and new password are required" });
    }

    const now = Date.now();
    const checkTokenQuery = "SELECT * FROM users WHERE user_email = ? AND token = ? AND reset_password_expiration > ?";
    const user = await db.query(checkTokenQuery, [email, token, now]);

    if (!user || user.length === 0) {
      return res.status(401).json({ error: "Token mismatch or expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatePasswordQuery = "UPDATE users SET user_password = ? WHERE user_email = ?";
    await db.query(updatePasswordQuery, [hashedPassword, email]);

    const clearTokenQuery = "UPDATE users SET token = NULL, reset_password_expiration = NULL WHERE user_email = ?";
    await db.query(clearTokenQuery, [user_email]);

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password: ", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

export default router;