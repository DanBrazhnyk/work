import express from "express";
import mysql from "mysql";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_REPORTS
});


router.get("/getComments", (req, res) => {
    const selectQuery = "SELECT * FROM comment";
  
    db.query(selectQuery, (err, results) => {
      if (err) {
        console.error("Error fetching comments data from MySQL:", err);
        res
          .status(500)
          .json({ error: "Error fetching comments data", details: err.message });
      } else {
        console.log("Fetched comments data from MySQL:", results);
        res.status(200).json(results);
      }
    });
  });

  
export default router;