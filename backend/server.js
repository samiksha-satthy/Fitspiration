import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 5000;

app.use(express.json());

app.use(cors({ origin: 'http://localhost:3000' }));

app.use("/api/auth", authRoutes);

app.listen(port, () => {
    console.log(`express listening on port ${port}`);
});