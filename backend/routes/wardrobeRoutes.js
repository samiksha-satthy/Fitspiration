import express from "express"
import multer from "multer";
import pool from "../config/db.js";
import fs from "fs"


const router = express.Router();
const uploadDir = './uploads';

const storage = multer.diskStorage({
  destination: function (req, file, cb){
          console.log(req.user.id)
          const folder = `uploads/${req.user.id}`
          fs.mkdirSync(folder, { recursive: true })
          cb(null, folder)
  },
  filename: function(req, file, cb){
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({storage: storage})

router.post("/upload-item", upload.single('myFile'), async(req, res) => {
    try{

        if (!req.isAuthenticated()) {
          return res.status(401).json({ message: "Unauthorized" });
        } 

        else{
            if (!req.file){
              res.send("no file uploaded ")
        }

            const response = await pool.query("INSERT INTO wardrobe_items (user_id, item_name, image_path) VALUES ($1, $2, $3)", [req.user.id, req.body.name, req.file.filename])
            const path = "../" + req.file.path

            res.send(response)
        }


    }catch(error) {
        res.send(error)
    }
})

router.get("/items", async(req, res) => {
    try {
        
    } catch (error) {
        
    }
})

router.get("/delete-item/:id", async(req, res) => {
    try {
        
    } catch (error) {
        
    }
})

export default router;