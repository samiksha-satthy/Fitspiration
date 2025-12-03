import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import authRoutes from "./routes/authRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import wardrobeRoutes from "./routes/wardrobeRoutes.js";
import passport from "passport";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.json());

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(
  session({
    secret: "TOPSECRETWORD",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api", recommendationRoutes);
app.use("/api", wardrobeRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(port, () => {
  console.log(`express listening on port ${port}`);
});
