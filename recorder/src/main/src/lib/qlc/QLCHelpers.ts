// import * as shelljs from "shelljs";
import fs from "fs";
import { join } from "path";
import Logger from "../logging/Logger";

const { spawn } = require("child_process");

/**
 * Start the QLC+ application
 */
export const openQLC = (file: string = "") => {
  const qlcPath = "/Applications/QLC+.app/Contents/MacOS/";
  const qlcExecutable = "qlcplus";
  if (!fs.existsSync(join(qlcPath, qlcExecutable)))
    throw new Error("QLC+ not installed");
  const args = ["-k", "-p"];
  if (file) args.push("-o", file);
  Logger.info(
    args.includes("-o")
      ? `Opening QLC+ with file ${file}`
      : "Opening QLC+ without a file"
  );
  spawn(join(qlcPath, qlcExecutable), args);
};

/**
 * Close the QLC+ application
 */
export const closeQLC = () => {
  spawn("killall", ["qlcplus"]);
};
