import express from "express";
import multer from "multer";
import pool from "../config/db.js";
import fs from "fs";
import { ChildProcess } from "child_process";
import { spawn } from "child_process";
import { error } from "console";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const uploadDir = "./uploads";


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      const folder = `uploads/${req.user.id}`;
      console.log("Destination folder:", folder);
      fs.mkdirSync(folder, { recursive: true });
      cb(null, folder);
    } catch (err) {
      cb(err);
    }
  },
  filename: function (req, file, cb) {
    console.log("Saving file:", file.originalname);
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function authMiddleware(req, res, next) {
  if (req.isAuthenticated) {
    return next();
  } else return res.send("authentication error!!");
}

router.post(
  "/upload-item",
  authMiddleware,
  upload.single("myFile"),
  async (req, res) => {
    try {
      if (!req.file) {
        res.send("no file uploaded ");
      }
      var image_path = `/uploads/${req.user.id}/${req.file.filename}`
      const response = await pool.query(
        "INSERT INTO items (user_id, item_name, image_path) VALUES ($1, $2, $3)",
        [req.user.id, req.body.name || "reg photo", image_path]
      );

      res.send(response);
    } catch (error) {
      res.send(error);
    }
  }
);

router.post("/upload-item-esp32", authMiddleware, async (req, res) => {
  try {
    const timestamp = Date.now();
    const userFolder = path.join("uploads", req.user.id.toString());

    // Ensure the folder exists
    fs.mkdirSync(userFolder, { recursive: true });

    const filePath = path.join(userFolder, `${timestamp}.jpg`);

    const writeStream = fs.createWriteStream(filePath);
    req.pipe(writeStream);

    writeStream.on("finish", async () => {
      await pool.query(
        "INSERT INTO items (user_id, item_name, image_path) VALUES ($1, $2, $3)",
        [req.user.id, req.body?.name || "esp32-photo", filePath]
      );
      res.send("saved!");
    });

  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/items", async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      const response = await pool.query(
        "SELECT image_path FROM users WHERE user_id=($1)",
        [req.user.id]
      );
    }
  } catch (error) {}
});

router.get("/delete-item/:id", async (req, res) => {
  try {
  } catch (error) {}
});

router.patch("/update-type/:id", async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      const update = await pool.query(
        "UPDATE items SET type=($1) WHERE id=($2)",
        [req.body.type, req.params.id]
      );

      const response = await pool.query("SELECT image_path FROM items WHERE id=($1)", [req.params.id])

      var first_part = req.user.name.split(" ")[0].toLowerCase();
      console.log(first_part);

      const scriptPath = path.join(
        __dirname,
        "../gemini_embeddings",
        "cohere_test.py"
      );
      const pythonPath = path.join(
        __dirname,
        "../gemini_embeddings/venv",
        "Scripts",
        "python.exe"
      );

      var pythonOutput = "";

      console.log("scriptPath:", scriptPath);
      console.log("pythonPath:", pythonPath);
      console.log("cwd:", process.cwd());


      const save_to_db = spawn(
        pythonPath,
        ["-u", scriptPath, response.rows[0].image_path, first_part, req.user.id, req.body.type],
        { cwd: path.resolve(__dirname, "../gemini_embeddings") }
      );

      save_to_db.stdout.on("data", (data) => {
        pythonOutput += data.toString();
        console.log(`Output: ${data.toString()}`);
      });

      save_to_db.stderr.on("data", (data) => {
        console.error(`Error: ${data.toString()}`);
      });

      save_to_db.on("error", (err) => {
        console.error("Failed to start Python process:", err);
      });

      save_to_db.on("close", (code) => {
        console.log(`Python process exited with code ${code}`);
        res.send({
          status: code === 0 ? "success" : "error",
          output: pythonOutput.trim(),
        });
      });
    } else {
      res.send("not authenticated");
    }
  } catch (error) {
    res.send(error);
  }
});

export default router;
