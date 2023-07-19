import { IDoorState } from "@shared/interfaces";
import { Recorder } from "../recorder";
import { MqttSingleton } from "../lib/mqtt/MqttSingleton";
import Logger from "../lib/logging/Logger";
import { Door } from "../door";
import { stopSession } from "./audio";
import SettingHelper from "../lib/settings/SettingHelper";
import SoundBoard from "../lib/audio/SoundBoard";

/**
 * Actions whenever the door state changes
 * @param param0
 */
export const doorStateChanged = async ({ open, battery }: IDoorState) => {
  // send to frontend
  Recorder.mainWindow.webContents.send("door-state", { open, battery });

  // set the door state in the singleton
  Door.open = open;
  Door.battery = battery;

  // Log
  Logger.info(`Door is ${open ? "open" : "closed"}.`);

  // if the door is open and the session is running, check if we need to stop the session
  if (Door.open && SoundBoard.sessionRunning) {
    // get setting
    const doorStopSession = Boolean(
      Number((await SettingHelper.getSetting("doorStopSession"))?.value)
    );

    // if we need to stop the session, do it
    if (doorStopSession) {
      // get the time after which the session should stop
      const doorStopSessionAfter = Number(
        (await SettingHelper.getSetting("doorStopSessionAfter"))?.value
      );

      // log
      Logger.info(
        `Door is open, session will stop after ${doorStopSessionAfter} seconds.`
      );

      // stop the session after the given time
      setTimeout(stopSession, doorStopSessionAfter * 1000);
    }
  }

  // @todo stop the session?
};

/**
 * Get the door state
 */
export const getDoorState = async () => {
  MqttSingleton.getInstance().publish("shellies/rumordoor/info");
};
