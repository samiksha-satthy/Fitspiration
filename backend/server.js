import express from 'express';
import connectDB from './config/db.js'

import authRoutes from "./routes/authRoutes.js"

dotenv.config();

const app = express();
const port = 3000;

app.use("/api/auth", authRoutes)

app.listen(port, () => {
    console.log(`express listening on port ${port}`)
})