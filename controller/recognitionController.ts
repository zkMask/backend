const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

exports.recognize = async (req: any, res: any, next: any) => {
  try {
    const { image } = req.body;
    const tempFolder = path.join(__dirname, "/../", "/temps");

    //Write base64 image to file
    const base64Data = image.replace(/^data:image\/png;base64,/, "");
    fs.writeFileSync(`${tempFolder}/temp.png`, base64Data, "base64");

    if (!image) {
      return res.status(400).json({ status: "fail", message: "No image" });
    }
    const db_path = path.join(__dirname, "/../", "/uploads").toString();
    const folderLocation = path.join(__dirname, "/../", "main.py");
    const python = spawn(
      "python3",
      [folderLocation, path.join(tempFolder, "/temp.png"), db_path],
      {
        maxBuffer: 1024 * 1024 * 1000,
      }
    );
    python.stdout.on("data", function (data: any) {
      console.log("Pipe data from python script ...");
      res.send(data);
    });
    python.stderr.on("data", (data: any) => {
      console.error(`stderr: ${data}`);
    });
    python.on("close", (code: any) => {
      console.log(`child process close all stdio with code ${code}`);
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "fail",
    });
  }
};

//unique key + hash of uniqueKey --> db
//ML model --> uniqueKey --> find in db --> returns uniqueKey + hash of uniqueKey --> (secret, signal) pair --> zkSNARK --> proof --> contract --> verify

//Swap --> Event --> RN --> Photo --> POST to Backend --> ML -->
