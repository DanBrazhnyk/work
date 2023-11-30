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

router.patch("/updateReport", (req, res) => {
  const {
    id_reports,
    id_priority,
    id_status,
    date_to_start_decision,
    deadline,
  } = req.body;
  const updateQuery = `
  UPDATE report 
  SET id_priority = ?, id_status = ?, date_to_start_decision = ?, deadline = ?
  WHERE id_reports = ?
`;
  const updateData = [
    id_priority,
    id_status,
    date_to_start_decision,
    deadline,
    id_reports,
  ];

  db.query(updateQuery, updateData, (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).send("Server Error");
    } else {
      res.status(200).send("Report updated");
    }
  });
});

export default router;
