/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */

import path from "path";
import { app, systemPreferences } from "electron";
import { ElectronApp } from "./lib";
import { registerActions, registerMethods } from "./register";
import { Recorder } from "./recorder";

/**
 * Get the resources path
 */
const resourcePath = app.isPackaged
  ? path.join(__dirname, "..", "..", "..")
  : path.join(__dirname, "..", "..", "..", "buildResources");

/**
 * Last thing to do when the window is closed
 */
app.on("window-all-closed", async () => {
  // Do not respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform === "darwin") {
    app.quit();
  }
});

/**
 * A function that will initialise our application
 */
const initApp = async () => {
  try {
    // when the application is ready
    await app.whenReady();

    // install react extension
    // await installExtension(REACT_DEVELOPER_TOOLS);

    // ask for microphone access
    systemPreferences.askForMediaAccess("microphone");

    // create a new electron app
    const electronApp = new ElectronApp({
      browserWidth: 900, // sets the browser width
      browserHeight: 795, // sets the browser height
      iconPath: path.join(resourcePath, "icon.icns"), // sets the app icon
      installExtensions: false, // shall we install react dev tools?
    });

    // create hte window
    const mainWindow = await electronApp.createWindow();

    // init the application
    Recorder.initApplication();

    // register actions to execute
    // (one way direction, from renderer to main)
    registerActions();

    // register the methods to handle
    // (two way direction, from renderer to main and back)
    registerMethods();

    // on activation
    app.on("activate", () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) electronApp.createWindow();
    });

    /**
     * Before quiting, close the kweenb application by killing all other processes
     */
    app.on("before-quit", async (event: any) => {
      event.preventDefault();
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send("closing");
      }
      app.exit(0);
    });
  } catch (e: any) {
    console.error(e.message);
  }
};

// init the application
initApp();
