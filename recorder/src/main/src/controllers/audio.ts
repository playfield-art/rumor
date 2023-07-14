import { AudioList } from "../../../shared/interfaces";
import { Exception } from "../lib/exceptions/Exception";
import SoundBoard from "../lib/audio/SoundBoard";
import { getAudioList as getAudioListHelper } from "../lib/audio/AudioList";
import Logger from "../lib/logging/Logger";
import { Recorder } from "../recorder";

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
  SoundBoard.initPlaylist(audioList);
};

/**
 * Start a new session
 */
export const startSession = async () => {
  try {
    // start a new session, trigger frontend if a soundscape needs to be played
    await SoundBoard.startSession((soundscape) => {
      Recorder.mainWindow.webContents.send("play-soundscape", soundscape);
    });

    // let the frontend know
    Recorder.mainWindow.webContents.send("session-started");

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
export const VOPlaylistDo = (
  event: Electron.IpcMainInvokeEvent,
  VOPlaylistAction: "stop" | "next"
) => {
  switch (VOPlaylistAction) {
    case "stop":
      SoundBoard.VOPlaylist.stop();
      break;
    case "next":
      if (!SoundBoard.VOPlaylist) break;
      SoundBoard.VOPlaylist.next();
      break;
    default:
      SoundBoard.VOPlaylist.stop();
  }
};

/**
 * Stop a session
 */
export const stopSession = async () => {
  // stop the playlist
  await SoundBoard.destroy();

  // let the frontend know and ask to cleanup the soundscape
  Recorder.mainWindow.webContents.send("session-stopped");

  // log
  await Logger.warn("Session force stopped.");
};
