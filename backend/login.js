import express from "express";
import mysql from "mysql";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const router = express.Router();
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_USERS,
});

router.post("/login", async (req, res) => {
  const { user_login, user_password } = req.body;
  const selectLoginData = `
  SELECT users.user_name, users.user_surname, users.user_email, users.user_phone,users.user_password, role.role_name 
  FROM users 
  INNER JOIN role ON users.id_role = role.id_role
  WHERE user_login = ?
`;

  
  db.query(selectLoginData, [user_login], async (err, results) => {
    if (err) {
      console.error("Error querying the database: ", err);
      res.status(500).json({ error: "An error occurred" });
    } else {
      if (results.length > 0) {
        const user = results[0];
        const passwordMatch = await bcrypt.compare(user_password, user.user_password);
        if (passwordMatch) {
          res.status(200).json({ message: "Login successful",
          user: {
            user_name: user.user_name,
            user_surname: user.user_surname,
            user_email: user.user_email,
            user_phone: user.user_phone,
            id_role: user.id_role,
            role_name: user.role_name,
          },});
        } else {
          res.status(401).json({ error: "Invalid login credentials" });
        }
      } else {
        res.status(404).json({ error: "User not found" });
      }
    }
  });
});

export default router;