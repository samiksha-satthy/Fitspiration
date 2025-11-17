import express from "express"
import multer from "multer";

const router = express.Router();
const uploadDir = './uploads';

const storage = multer.diskStorage({
  destination: function (req, file, cb){
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb){
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({storage: storage})

router.post("/upload-item", upload.single('myFile'), async(req, res) => {
    try{
        if (!req.file){
            res.send("no file uploaded ")
        }

        res.send("file uploaded successfully" + req.file.filename);
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