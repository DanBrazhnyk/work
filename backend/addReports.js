import express from "express";
import mysql from "mysql";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import multer from "multer";

dotenv.config();

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password:  process.env.DB_PASSWORD,
  database: process.env.DB_REPORTS,
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

router.post('/addReport', upload.array('file_report', 12), (req, res) => {
  const { sender_email, report_theme, report_text, id_type, id_localization } = req.body;
  const files = req.files;

  const reportQuery = 'INSERT INTO report SET ?';
  const reportData = {
    sender_email,
    report_theme,  
    report_text,
    file_report: files.map(file => file.originalname).join(', '),
    id_type,
    id_localization,
  };

  db.query(reportQuery, reportData, (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).send('Server Error');
    } else {
      const mailOptions = {
        from: sender_email, 
        to: "mr.krubs1996@gmail.com",
        subject: `New  report ${report_theme}`,
        text: report_text,
        attachments: files.map(file => ({
          filename: file.originalname,
          content: file.buffer
        }))
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
          res.status(200).send('Report added and email sent');
        }
      });
    }
  });
});

export default router;