import express from "express";
import * as path from "path";
import cors from "cors";

/**
 * Init Express
 */

// define paths
const publicFolder = path.join(__dirname, '..', 'webserver');

// define some variable
const port = 5050;
let isServerRunning = false;

// create express app
const app = express();

// enable cors
app.use(cors());

// set the public folder
app.use(express.static(publicFolder));

// create express router
const router = express.Router();
app.use("/", router);

/**
 * Endpoints
 */

router.get('*', (req, res) => {
  res.sendFile(path.join(publicFolder, 'index.html'));
});

/**
 * Run server
 */

(async () => {
  app.listen(port, () => {
    // console.log(`Server running at http://localhost:${port}`)
    isServerRunning = true;
    process.send("isServerRunning");
  });
})().catch(console.error);

// listen for message from parent process
process.on("message", (data) => {
  if (data === "isServerRunning" && isServerRunning) {
    process.send("isServerRunning");
  }
});