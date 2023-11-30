import express from "express";
import mysql from "mysql";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_REPORTS,
});

router.get('/getStatus', (req, res) => {
  const query = "SELECT * FROM status"

  db.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching name_status:', err);
      res.status(500).json({ error: 'Internal Server Error', details: err.message });
    } else {
      res.json(result);
    }
  });
});

export default router;