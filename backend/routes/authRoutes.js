import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

router.post("/signup", async (req, res) => {
    try {
        console.log("signup route hit", req.body.email);
        // Add RETURNING * so we get the created row back
        // Protect against DB hangs by racing the query with an 8s timeout
        const queryPromise = await pool.query(
            `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`,
            [req.body.name, req.body.email, req.body.password]
        );

        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('DB query timeout')), 8000)
        );

        const result = await Promise.race([queryPromise, timeoutPromise]);
        console.log("DB insert result:", result.rows && result.rows[0]);
        return res.status(201).json({ user: result.rows[0] });
    } catch (error) {
        console.error('signup error:', error);
        if (error.message && error.message.includes('timeout')) {
          return res.status(504).json({ error: 'Database timeout' });
        }
        return res.status(500).json({ error: 'Server error' });
    }
});

router.post("/login", async(req, res) => {
    try {
        console.log("haro?")
        const response = await pool.query(`SELECT password FROM users WHERE email=($1)`, [req.body.email]);

        if (!response.rows || response.rows.length === 0) {
            console.log('login: no user found for', req.body.email);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (response.rows[0].password == req.body.password){
            console.log("worked!")
        }
        else {
            console.log("heheh nope")
        }
    } catch (error) {
        console.log(error)
    }
});

export default router;

