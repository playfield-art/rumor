import { QLCFunction } from "@shared/enums";
import { AudioList } from "../../../shared/interfaces";
import { Exception } from "../lib/exceptions/Exception";
import SoundBoard from "../lib/audio/SoundBoard";
import { getAudioList as getAudioListHelper } from "../lib/audio/AudioList";
import Logger from "../lib/logging/Logger";
import SettingHelper from "../lib/settings/SettingHelper";
import { Door } from "../door";
import { QLCSingleton } from "../lib/qlc/QLCSingleton";
import { SocketSingleton } from "../lib/socket/SocketSingleton";

/**
 * Get the audiolist
 * @returns AudioList with VO and SC
 */
export const getAudioList = async (
  event: Electron.IpcMainInvokeEvent,
  language: string
): Promise<AudioList> => getAudioListHelper(language);

/**
 * Set new voice overs for the internal voice overs playlist
 * @param voiceOvers
 */
export const initPlaylist = (
  event: Electron.IpcMainInvokeEvent,
  audioList: AudioList
) => {
  try {
    SoundBoard.initPlaylist(audioList);
  } catch (e: any) {
    throw new Exception({ where: "initPlaylist", message: e.message });
  }
};

/**
 * Start a new session
 */
export const startSession = async () => {
  try {
    /**
     * Validate
     */

    if (SoundBoard.sessionRunning) {
      // change the page on the interface
      SocketSingleton.getInstance().sendToClients(
        "change-page",
        "during-performance"
      );
    }

    /**
     * Check if we need to wait for the door to be closed
     */

    // log
    await Logger.info("Checking the door.");

    // do we start a session only when door is closed?
    const startSessionAfterDoorIsClosed = Boolean(
      Number(
        (await SettingHelper.getSetting("startSessionAfterDoorIsClosed"))?.value
      )
    );

    // if we need to wait for the door to be closed, check if the door is closed
    if (startSessionAfterDoorIsClosed && Door.open) {
      await Logger.error("Can't start session, door is open.");
      return;
    }

    /**
     * Start the session in the soundboard
     */

    // log
    await Logger.info("Starting the soundboard session.");

    // start a new session, trigger frontend if a soundscape needs to be played
    await SoundBoard.startSession();

    /**
     * Set the light to dimmed light intensity
     */

    // log
    await Logger.info("Set light to dimmed intensity.");

    // trigger the QLC function
    QLCSingleton.getInstance().triggerFunction(
      QLCFunction.FADE_TO_DIMMED_LIGHT_INTENSITY
    );

    /**
     * Set the interface to during performance
     */

    // log
    await Logger.info("Set the interface to during performance state.");

    // change the page on the interface
    SocketSingleton.getInstance().sendToClients(
      "change-page",
      "during-performance"
    );

    /**
     * Log our success
     */
    await Logger.success("Session started.");
  } catch (e: any) {
    throw new Exception({ where: "startSession", message: e.message });
  }
};

/**
 * Voice Over playlist do something...
 * @param event
 * @param VOPlaylistAction
 */
export const VOPlaylistDo = async (
  event: Electron.IpcMainInvokeEvent,
  VOPlaylistAction: "next"
) => {
  switch (VOPlaylistAction) {
    case "next":
      await SoundBoard.next();
      break;
    default:
      break;
  }
};

/**
 * Stop a session
 */
export const stopSession = async () => {
  try {
    /**
     * Validate
     */

    if (!SoundBoard.sessionRunning) {
      // change the page on the interface
      SocketSingleton.getInstance().sendToClients(
        "change-page",
        "set-language"
      );
    }

    /**
     * Stop the session in the soundboard
     */

    // log
    await Logger.info("Stopped the soundboard session.");

    // stop the playlist
    await SoundBoard.stopSession();

    /**
     * Set the light to max light intensity
     */

    // log
    await Logger.info("Set light to max intensity.");

    // trigger the QLC function
    QLCSingleton.getInstance().triggerFunction(
      QLCFunction.FADE_TO_MAX_LIGHT_INTENSITY
    );

    /**
     * Set the interface to set language
     */

    // log
    await Logger.info("Set the interface to set language state.");

    // change the page on the interface
    SocketSingleton.getInstance().sendToClients("change-page", "set-language");

    /**
     * Log our success
     */
    await Logger.success("Session force stopped.");
  } catch (e: any) {
    throw new Exception({ where: "stopSession", message: e.message });
  }
};
