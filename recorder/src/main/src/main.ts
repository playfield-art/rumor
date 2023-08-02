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

import { resourcesPath } from "@shared/resources";
import { ElectronApp } from "./lib";
import { registerActions, registerMethods } from "./register";
import { Recorder } from "./recorder";
import SoundBoard from "./lib/audio/SoundBoard";
import { killProcess } from "./lib/process/killProcess";
import Logger from "./lib/logging/Logger";
import { MqttSingleton } from "./lib/mqtt/MqttSingleton";
import { initMQTT } from "./mqtt";
import { initQLC } from "./qlc";
import { closeQLC } from "./lib/qlc/QLCHelpers";
import { initSerialButton } from "./button";
import { SerialButtonSingleton } from "./lib/serial/SerialButtonSingleton";
import { initExpress, killExpress } from "./express";
import { initSocketIo } from "./socket";
import { initCron, stopAllCronJobs } from "./cron";

/**
 * Electron Application
 */

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

    // log out
    Logger.detail("Application started.");

    // ask for microphone access
    systemPreferences.askForMediaAccess("microphone");

    // create a new electron app
    const electronApp = new ElectronApp({
      browserWidth: 900, // sets the browser width
      browserHeight: 795, // sets the browser height
      iconPath: path.join(resourcesPath, "icon.icns"), // sets the app icon
      installExtensions: false, // shall we install react dev tools?
    });

    // create the window
    const mainWindow = await electronApp.createWindow();

    // make the main window global
    if (mainWindow) Recorder.mainWindow = mainWindow;

    // init the express server
    initExpress();

    // init the application
    await Recorder.initApplication();

    // init the button
    await initSerialButton();

    // init MQTT
    await initMQTT();

    // init QLC
    await initQLC();

    // init Socket IO
    initSocketIo();

    // init the cron job for syncing data
    initCron();

    // register actions to execute
    // (one way direction, from renderer to main)
    registerActions();

    // register the methods to handle
    // (two way direction, from renderer to main and back)
    registerMethods();

    // show the main window
    Recorder.mainWindow.show();

    /**
     * Before quiting, close the kweenb application by killing all other processes
     */
    app.on("before-quit", async (event: any) => {
      // prevent the application from quitting
      event.preventDefault();

      // Start closing
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send("closing");
      }

      // kill the express process
      killExpress();

      // destroy the soundboard
      await SoundBoard.destroy();

      // to be sure, kill everything like a terminator
      await killProcess("afplay");

      // close QLC
      closeQLC();

      // close the serial connection
      await SerialButtonSingleton.getInstance()?.closeConnection();

      // close the mqtt client
      MqttSingleton.getInstance()._mqttClient?.end(true);

      // stop the cron job
      await stopAllCronJobs();

      // save logs
      await Logger.detail("Application is closing...");

      // exit the application
      app.exit(0);
    });
  } catch (e: any) {
    console.error(e.message);
  }
};

// init the application
initApp();
