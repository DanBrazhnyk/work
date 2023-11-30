import express from "express";
import mysql from "mysql";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const router = express.Router();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_USERS,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Connected to the database");
  }
});

const insertIntoUsers =
  "INSERT INTO users (user_name, user_surname, user_email, user_phone, user_login, user_password, id_role) VALUES (?, ?, ?, ?, ?, ?, ?)";

router.post("/signUp", async (req, res) => {
  try {
    const {
      user_name,
      user_surname,
      user_email,
      user_phone,
      user_login,
      user_password,
      id_role,
    } = req.body;

    console.log(
      "Received data:",
      user_name,
      user_surname,
      user_email,
      user_phone,
      user_login,
      user_password,
      id_role
    );
    if (id_role >= 1 && id_role <= 4) {
      const hashedPassword = await bcrypt.hash(user_password, 10);

      db.query(
        insertIntoUsers,
        [
          user_name,
          user_surname,
          user_email,
          user_phone,
          user_login,
          hashedPassword,
          id_role,
        ],
        (err, result) => {
          if (err) {
            console.error("Error inserting data into the database: ", err);
            res.status(500).json({ error: "An error occurred" });
          } else {
            console.log("Data inserted successfully");
            res.status(200).json({ message: "Data inserted successfully" });
          }
        }
      );
    } else {
      res.status(400).json({ error: "Invalid role id" });
    }
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

export default router;
