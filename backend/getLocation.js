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

router.get('/getLocalizations', (req, res) => {
  const query = 'SELECT * FROM localization';
  db.query(query, (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).send('Server Error');
    } else {
      res.status(200).json(results);
    }
  });
});

export default router;