import fs from "fs";
import path from "path";
import { Utils } from "@shared/utils";
import { AudioList, RecordingMeta } from "../../../shared/interfaces";

import SettingHelper from "../lib/settings/SettingHelper";
import { AudioRecordingSingleton } from "../lib/audio/AudioRecordingSingleton";
import { Exception } from "../lib/exceptions/Exception";
import { getAudioList as getAudioListHelper } from "../lib/audio/AudioList";

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
export const createNewSession = async (
  event: Electron.IpcMainInvokeEvent,
  language: string
) => {
  // create new audiolist
  const audioList = await getAudioListHelper(language);

  // get the recording folder from settings
  const recordingsFolderSetting = await SettingHelper.getSetting(
    "recordingsFolder"
  );

  // if no recording folder, throw an exception
  if (!recordingsFolderSetting) {
    throw new Exception({
      message: "There was no recordings folder provided.",
      where: "createNewSession",
    });
  }

  // generate a session id
  const recordingMeta: RecordingMeta = {
    language,
    boothSlug: "ru1", // @TODO get this from settings
    sessionId: Utils.generateUniqueNameByDate(),
    recordingDate: Utils.currentDate(),
    recordingTime: Utils.currentTime(),
  };

  // create a new folder
  const folder = path.join(
    recordingsFolderSetting.value,
    recordingMeta.sessionId
  );
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
    AudioRecordingSingleton.getInstance().outDir = folder;
  }

  // add some meta information to the folder
  fs.writeFileSync(`${folder}/meta.json`, JSON.stringify(recordingMeta));
  fs.writeFileSync(`${folder}/audiolist.json`, JSON.stringify(audioList));

  // return the audio list to work with
  return audioList;
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
export const stopRecording = () => {
  AudioRecordingSingleton.getInstance().stopRecording();
};
