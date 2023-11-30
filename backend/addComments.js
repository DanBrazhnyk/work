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

router.post('/addComment', upload.array('file_comment', 12), (req, res) => {
  const { comment_sender, comment_text, response_team,id_reports, deadline } = req.body;
  const files = req.files;
  const commentQuery = 'INSERT INTO comment SET ?';
  const commentData = {
    comment_sender,
    comment_text,
    response_team,
    id_reports,
    deadline,
    file_comment: files.map(file => file.originalname).join(', '),
  };

  db.query(commentQuery, commentData, (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).send('Server Error');
    } else {
 
      const mailOptions = {
        from: comment_sender,
        to: "mr.krubs1996@gmail.com",
        subject: `New comment for report ${comment_sender}`,
        text: comment_text,
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
          res.status(200).send('Comment added and email sent');
        }
      });
    }
  });
});

export default router;