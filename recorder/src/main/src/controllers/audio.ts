import { AudioList } from "../../../shared/interfaces";
import { Exception } from "../lib/exceptions/Exception";
import SoundBoard from "../lib/audio/SoundBoard";
import { getAudioList as getAudioListHelper } from "../lib/audio/AudioList";
import Logger from "../lib/logging/Logger";
import SettingHelper from "../lib/settings/SettingHelper";
import { Door } from "../door";

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
    // do we start a session only when door is closed?
    const startSessionAfterDoorIsClosed = Boolean(
      Number(
        (await SettingHelper.getSetting("startSessionAfterDoorIsClosed"))?.value
      )
    );

    // if we need to wait for the door to be closed, check if the door is closed
    if (startSessionAfterDoorIsClosed && Door.open) {
      Logger.error("Can't start session, door is open.");
      return;
    }

    // start a new session, trigger frontend if a soundscape needs to be played
    await SoundBoard.startSession();

    // Log
    Logger.success("Session started.");
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
    // stop the playlist
    await SoundBoard.stopSession();

    // log
    await Logger.warn("Session force stopped.");
  } catch (e: any) {
    throw new Exception({ where: "stopSession", message: e.message });
  }
};
