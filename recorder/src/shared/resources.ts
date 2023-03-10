import path from "path";
import { app } from "electron";

// Get the path that `extraResources` are sent to. This is `<app>/Resources`
// on macOS. remote.app.getAppPath() returns `<app>/Resources/app.asar` so
// we just get the parent directory. If the app is not packaged we just use
// `<current working directory>/resources`.
export const resourcesPath = app.isPackaged
  ? path.dirname(app.getAppPath())
  : path.resolve("resources");
