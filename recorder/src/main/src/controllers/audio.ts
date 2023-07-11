import fs from "fs";
import path from "path";
import { Utils } from "@shared/utils";
import { AudioList, RecordingMeta } from "../../../shared/interfaces";
import { AudioRecordingSingleton } from "../lib/audio/AudioRecordingSingleton";
import { Exception } from "../lib/exceptions/Exception";
import SoundBoard from "../lib/audio/SoundBoard";
import { getAudioList as getAudioListHelper } from "../lib/audio/AudioList";
import { getRecordingsFolder } from "../lib/filesystem";
import SettingsHelper from "../lib/settings/SettingHelper";
import Logger from "../lib/logging/Logger";

/**
 * Get the audiolist
 * @returns AudioList with VO and SC
 */
export const getAudioList = async (
  event: Electron.IpcMainInvokeEvent,
  language: string
): Promise<AudioList> => getAudioListHelper(language);

/**
 * Creates a new recording folder and adds this to the internale AudioRecording
 * @returns
 */
export const createNewSession = async () => {
  // get the language
  const language = await SettingsHelper.getLanguage();

  // create new audiolist
  const audioList = await getAudioListHelper(language);

  // get the recording folder from settings
  const recordingsFolder = await getRecordingsFolder();

  // get the booth slug
  const boothSlug = await SettingsHelper.getBoothSlug();

  // if no booth slug, throw an exception
  if (!boothSlug) {
    throw new Exception({
      message: "There was no boothSlug found in the settings.",
      where: "createNewSession",
    });
  }

  // if no recording folder, throw an exception
  if (!recordingsFolder) {
    throw new Exception({
      message: "There was no recordings folder provided.",
      where: "createNewSession",
    });
  }

  // generate a session id
  const recordingMeta: RecordingMeta = {
    language,
    boothSlug,
    sessionId: Utils.generateUniqueNameByDate(),
    recordingDate: Utils.currentDate(),
    recordingTime: Utils.currentTime(),
  };

  // create a new folder
  const folder = path.join(recordingsFolder, recordingMeta.sessionId);
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
    AudioRecordingSingleton.getInstance().outDir = folder;
  }

  // add some meta information to the folder
  fs.writeFileSync(`${folder}/meta.json`, JSON.stringify(recordingMeta));
  fs.writeFileSync(`${folder}/audiolist.json`, JSON.stringify(audioList));

  Logger.info(`Created new session: ${recordingMeta.sessionId}`);

  // return the audio list to work with
  return audioList;
};

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
 * Voice Over playlist do something...
 * @param event
 * @param VOPlaylistAction
 */
export const VOPlaylistDo = (
  event: Electron.IpcMainInvokeEvent,
  VOPlaylistAction: "start" | "stop" | "next"
) => {
  switch (VOPlaylistAction) {
    case "start":
      SoundBoard.VOPlaylist.start();
      break;
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
 * Start the recording
 * @param fileName
 */
export const startRecording = (
  event: Electron.IpcMainInvokeEvent,
  language: string,
  id: number
) => {
  AudioRecordingSingleton.getInstance().startRecording(language, id);
};

/**
 * Stop the recording
 */
export const stopRecording = async () => {
  await AudioRecordingSingleton.getInstance().stopRecording();
};
