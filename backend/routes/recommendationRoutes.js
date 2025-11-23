import express from "express"

const router = express.Router();

router.post("/recommendations", async(req, res) => {
    try {
        if (req.isAuthenticated()){
            
        }
    } catch (error) {
        console.log(error)
    }
})

export default router;