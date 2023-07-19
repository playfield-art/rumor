// import * as shelljs from "shelljs";
import fs from "fs";
import { join } from "path";

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
  console.log(args);
  spawn(join(qlcPath, qlcExecutable), args);
};

/**
 * Close the QLC+ application
 */
export const closeQLC = () => {
  spawn("killall", ["qlcplus"]);
};
