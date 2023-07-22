import { fork, ChildProcess } from "child_process";
import path from "path";

export const initExpress = (): ChildProcess | null => {
  const isDevelopment = process.env.NODE_ENV !== "production";
  const serverProcess = fork(
    isDevelopment
      ? path.resolve(__dirname, "../public/server.js")
      : path.resolve(__dirname, "server.js")
  );
  try {
    if (serverProcess) {
      serverProcess.stdout?.on("data", console.log);
      serverProcess.stderr?.on("data", console.error);
    }
    return serverProcess;
  } catch (e) {
    console.error(e);
    return null;
  }
};
