import express from "express";
import mysql from "mysql";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password:  process.env.DB_PASSWORD,
  database: process.env.DB_REPORTS,
});

  router.patch("/editTextComment", async (req, res) => {

    const {id_comment,comment_text } = req.body;
  
    const updateQuery = "UPDATE comment SET comment_text = ? WHERE id_comment = ?";
  
    db.query(updateQuery, [comment_text, id_comment], (err, result) => {
      if (err) {
        console.error("Error updating comment:", err);
        return res
          .status(500)
          .json({ error: "Server error updating comment" });
      }
      console.log("The comment was successfully updated in the database");
      res.status(200).json({ message: "Comment successfully updated" });
    });
  });  

  router.patch("/editDeadline", async (req, res) => {

    const {id_comment,deadline } = req.body;
  
    const updateQuery = "UPDATE comment SET deadline = ? WHERE id_comment = ?";
  
    db.query(updateQuery, [deadline, id_comment], (err, result) => {
      if (err) {
        console.error("Error updating comment:", err);
        return res
          .status(500)
          .json({ error: "Server error updating comment" });
      }
      console.log("The comment was successfully updated in the database");
      res.status(200).json({ message: "Comment successfully updated" });
    });
  }); 

   router.patch("/editTeam", async (req, res) => {

    const {id_comment,response_team } = req.body;
  
    const updateQuery = "UPDATE comment SET response_team = ? WHERE id_comment = ?";
  
    db.query(updateQuery, [response_team, id_comment], (err, result) => {
      if (err) {
        console.error("Error updating comment:", err);
        return res
          .status(500)
          .json({ error: "Server error updating comment" });
      }
      console.log("The comment was successfully updated in the database");
      res.status(200).json({ message: "Comment successfully updated" });
    });
  });
  

  
export default router;