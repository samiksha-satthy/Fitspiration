import express from "express";
import path from "path";
import { ChildProcess } from "child_process";
import { spawn } from "child_process";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


router.post("/recommendations", async (req, res) => {
  try {
    console.log(req.body)
    if (req.isAuthenticated()) {
      const scriptPath = path.join(
        __dirname,
        "../gemini_embeddings",
        "search_db.py"
      );
      const pythonPath = path.join(
        __dirname,
        "../gemini_embeddings/venv",
        "Scripts",
        "python.exe"
      );

      
      var pythonOutput = ""
      var first_part = req.user.name.split(" ")[0].toLowerCase();
      console.log(first_part);

      const search_db = spawn(
        pythonPath,
        ["-u", scriptPath, `${first_part}-${req.user.id}`, req.body.query],
        {
          cwd: path.resolve(__dirname, "../gemini_embeddings"),
        }
      );

      search_db.stdout.on("data", (data) => {
        pythonOutput += data.toString();
        console.log(`Output: ${data.toString()}`);
      });

      search_db.stderr.on("data", (data) => {
        console.error(`Error: ${data.toString()}`);
      });

      search_db.on("error", (err) => {
        console.error("Failed to start Python process:", err);
      });

      search_db.on("close", (code) => {
        console.log(`Python process exited with code ${code}`);
        res.send({
          status: code === 0 ? "success" : "error",
          output: pythonOutput.trim(),
        });
      });
    }
  } catch (error) {
    console.log(error);
  }
});

export default router;
