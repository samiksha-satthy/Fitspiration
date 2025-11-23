import express from "express";
import multer from "multer";
import pool from "../config/db.js";
import fs from "fs";
import { ChildProcess } from "child_process";
import { spawn } from "child_process";

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
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });


router.post("/upload-item", upload.single("myFile"), async (req, res) => {

  try {
    console.log("hihihih");
    if (!req.file) {
      res.send("no file uploaded ");
    }

    const response = await pool.query(
      "INSERT INTO wardrobe_items (user_id, item_name, image_path) VALUES ($1, $2, $3)",
      [req.user.id, req.body.name, req.file.filename]
    );


    const convert_base64 = spawn('python', ['cohere_test.py', `${response}/${req.file.filename}`])

    convert_base64.stdout.on('data', (data, err) => {
        if (err)
          throw new err
        else {
          const get_embedding = spawn('python', ['cohere_test.py', data])
        }
    });


    res.send(response);



  } catch (error) {
    res.send(error);
  }
});

router.get("/items", async (req, res) => {
  try {
  } catch (error) {}
});

router.get("/delete-item/:id", async (req, res) => {
  try {
  } catch (error) {}
});

export default router;
