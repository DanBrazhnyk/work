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

  router.delete("/deleteComment", async (req, res) => {
    const { id_comment } = req.body;
  
    const deleteQuery = "DELETE FROM comment WHERE id_comment = ?";
  
    db.query(deleteQuery, [id_comment], (err, result) => {
      if (err) {
        console.error("Error during deleting comment from MySQL:", err);
        return res
          .status(500)
          .json({ error: "Server Error" });
      }
      console.log("Comment successfully deleted:");
      res.status(200).json({ message: "Comment successfully deleted:" });
    });
  });
  
export default router;