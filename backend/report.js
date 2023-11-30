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
  password: process.env.DB_PASSWORD,
  database: process.env.DB_REPORTS,
});


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

router.post('/addReport', upload.array('file_report', 12), async (req, res) => {
    const { sender_email, report_theme, report_text, id_type, id_localization } = req.body;
  
    db.query(
      'INSERT INTO report (sender_email, report_theme, report_text, id_type, id_localization) VALUES (?, ?, ?, ?, ?)',
      [sender_email, report_theme, report_text, id_type, id_localization],
      async (error, results) => {
        if (error) {
          res.status(500).json({ error: 'Failed to add report' });
          return;
        }
  
        const reportId = results.insertId;
  
        const files = req.files.map((file) => [reportId, file.originalname]);
        db.query(
          'INSERT INTO files (id_reports,file) VALUES ?',
          [files],
          async (error, results) => {
            if (error) {
              res.status(500).json({ error: 'Failed to add files' });
              return;
            }
            try {
              const info = await transporter.sendMail({
                from: sender_email,
                to: "mr.krubs1996@gmail.com",
                subject: report_theme,
                text: report_text,
                attachments: req.files.map((file) => ({
                  filename: file.originalname,
                  content: file.buffer,
                })),
              });
  
              console.log('Email sent: ', info);
            } catch (emailError) {
              console.error('Error sending email:', emailError);
            }
  
            res.status(200).json({ message: 'Report and files added successfully' });
          }
        );
      }
    );
  });
export default router;
