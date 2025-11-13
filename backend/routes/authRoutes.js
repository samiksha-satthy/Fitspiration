import express from 'express';
import connectDB from './config/db.js'

const router = express.Router();

router.post("/signup", async(req, res) => {
    try {
        console.log("hellooooooo")
        const result = await connectDB.query(
            `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`,
            [req.name, req.email, req.password]
        );
        console.log(result.rows[0])
    } catch (error) {
        console.log(error)
    }
})

