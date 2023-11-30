import express from "express";
import mysql from "mysql";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_USERS,
});

router.get('/getRoles', (req, res) => {
  const query = "SELECT users.*,role.role_name FROM users JOIN role ON users.id_role = role.id_role"

  db.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching users with roles:', err);
      res.status(500).json({ error: 'Internal Server Error', details: err.message });
    } else {
      res.json(result);
    }
  });
});

export default router;
