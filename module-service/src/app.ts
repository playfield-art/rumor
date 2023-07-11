import express from "express";
import { WEBSERVER_PORT } from "./consts";

/**
 * Express configuration.
 */
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// start the application
app.listen(WEBSERVER_PORT, () => {
  console.log(`Our application is running at http://localhost:${WEBSERVER_PORT}`);
});