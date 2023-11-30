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

  router.delete("/deleteReport", async (req, res) => {
    const { id_reports } = req.body;
  
    const deleteQuery = "DELETE FROM report WHERE id_reports = ?";
  
    db.query(deleteQuery, [id_reports], (err, result) => {
      if (err) {
        console.error("Error during deleting report from MySQL:", err);
        return res
          .status(500)
          .json({ error: "Server Error" });
      }
      console.log("Report successfully deleted:");
      res.status(200).json({ message: "Report successfully deleted:" });
    });
  });
  
export default router;