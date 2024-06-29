const express = require("express");
const ffmpeg = require("fluent-ffmpeg");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(express.static(path.join(__dirname, "build")));
app.use(cors());

app.post("/convert", upload.single("file"), (req, res) => {
  const inputFile = req.file.path;
  const outputFile = `${req.file.path.split(".")[0]}.mp3`;

  ffmpeg(inputFile)
    .output(outputFile)
    .on("end", () => {
      res.download(outputFile, (err) => {
        if (err) {
          console.error("Error downloading file:", err);
        } else {
          console.log("File downloaded successfully");
        }
      });
    })
    .on("error", (err) => {
      console.error("Error converting file:", err);
      res.status(500).send("Error converting file");
    })
    .run();
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
