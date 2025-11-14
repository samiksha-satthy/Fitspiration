import express from "express";
import pool from "../config/db.js";
import bcrypt from "bcrypt";

const router = express.Router();
const saltRounds = 10;

router.post("/signup", async (req, res) => {
  try {
    console.log("heyyy")
    const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
      req.body.email,
    ]);

    // console.log(result)

    if (result.rows.length != 0) {
      console.log("email already exists!");
      res.send()
    } else {
      bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
        if (err) {
          console.log(err);
        } else {
          const response = await pool.query(
            `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`,
            [req.body.name, req.body.email, hash]
          );

          console.log(response.rows[0].password);
          res.send()
        }
      });
    }
  } catch (error) {
    console.error("signup error:", error);
  }
});

router.post("/login", async (req, res) => {
  try {
    console.log("haro?");
    const response = await pool.query(
      `SELECT password FROM users WHERE email=($1)`,
      [req.body.email]
    );

    if (!response.rows || response.rows.length === 0) {
      console.log("login: no user found for", req.body.email);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (response.rows[0].password == req.body.password) {
      console.log("worked!");
    } else {
      console.log("heheh nope");
    }
  } catch (error) {
    console.log(error);
  }
});

export default router;
