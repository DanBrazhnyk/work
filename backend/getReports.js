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

router.get("/getReports", (req, res) => {
  const selectQuery = `
  SELECT 
  report.id_reports,
  report.report_theme,
  report.report_text,
  report.deadline, 
  report.date_to_start_decision,
  localization.name_localization,
  type_of_report.name_type,
  status.name_status,
  priority.name_priority
  FROM report
  LEFT JOIN localization ON report.id_localization = localization.id_localization
  LEFT JOIN type_of_report ON report.id_type = type_of_report.id_type
  LEFT JOIN status ON report.id_status = status.id_status
  LEFT JOIN priority ON report.id_priority = priority.id_priority
`;
//   const selectQuery = `
//   SELECT 
//   report.id_reports,
//   report.report_theme,
//   report.report_text,
//   report.deadline, 
//   report.date_to_start_decision,
//   localization.name_localization,
//   type_of_report.name_type,
//   status.name_status,
//   priority.name_priority
// FROM report
// INNER JOIN localization ON report.id_localization = localization.id_localization
// INNER JOIN type_of_report ON report.id_type = type_of_report.id_type
// INNER JOIN status ON report.id_status = status.id_status
// INNER JOIN priority ON report.id_priority = priority.id_priority
// `;

  db.query(selectQuery, (err, results) => {
    if (err) {
      console.error("Error fetching report data from MySQL:", err);
      res
        .status(500)
        .json({ error: "Error fetching report data", details: err.message });
    } else {
      console.log("Fetched report data from MySQL:", results);
      res.status(200).json(results);
    }
  });
});

export default router;
