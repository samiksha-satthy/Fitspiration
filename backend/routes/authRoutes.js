import express from "express";
import pool from "../config/db.js";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import session from "express-session";
import * as dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const saltRounds = 10;

router.get("/me", async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      return res.status(200);
    }
  } catch (error) {
    return res.status(400);
  }
});

router.post("/signup", async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
      req.body.email,
    ]);

    if (result.rows.length != 0) {
      console.log("email already exists!");
      res.sendStatus(400);
    } else {
      bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
        if (err) {
          console.log(err);
        } else {
          const response = await pool.query(
            `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`,
            [req.body.name, req.body.email, hash]
          );
          return res.sendStatus(200);
        }
      });
    }
  } catch (error) {
    console.error("signup error:", error);
  }
});

router.post(
  "/login",
  passport.authenticate("local", { session: true }),
  (req, res) => {
    return res.sendStatus(200);
  }
);

passport.use(
  new Strategy(
    { usernameField: "email", passwordField: "password" },
    async function verify(email, password, cb) {
      try {
        console.log(email, password);
        const response = await pool.query(
          `SELECT password, id FROM users WHERE email=($1)`,
          [email]
        );

        const user = response.rows[0];

        if (!response.rows || response.rows.length === 0) {
          console.log("login: no user found for", email);
          return cb(null, false);
        }

        bcrypt.compare(password, response.rows[0].password, (err, result) => {
          console.log(result);
          if (err) {
            return cb(err);
          }
          if (result) {
            console.log("this runs");
            return cb(null, user);
          } else {
            return cb(null, false);
          }
        });
      } catch (error) {
        return cb(error);
      }
    }
  )
);

passport.serializeUser((user, cb) => {
  console.log("Serialize user:", user);
  cb(null, user.id);
});

passport.deserializeUser(async(id, cb) => {
  try {
    const result = await pool.query(
      "SELECT id, email FROM users WHERE id = $1", [id]
    )

    if (!result.rows[0]) return cb(null, false);
    cb(null, result.rows[0])
  } catch (error) {
    cb(error)
  }
});

export default router;
