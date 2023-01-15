import { AudioList, SoundScape, VoiceOver } from "../../../shared/interfaces";
import fs from 'fs';
import { UNWANTED_FILES } from "../consts";
import SettingHelper from "../lib/settings/SettingHelper";
import path from 'path';
import { Utils } from '@shared/utils';
import { AudioRecordingSingleton } from "../lib/audio/AudioRecordingSingleton";
import { Exception } from "../lib/exceptions/Exception";

/**
 * Get the audiolist
 * @returns AudioList with VO and SC
 */
export const getAudioList = async (): Promise<AudioList> => {
  // get the narratives folder from settings
  const narrativesFolderSetting = await SettingHelper.getSetting('narrativesFolder');

  // validate
  if(!narrativesFolderSetting) return { VO: [], SC: [] }

  // get the narratives folder
  const narrativesFolder = narrativesFolderSetting.value;

  // get all the audio files
  const audioFiles = fs.readdirSync(narrativesFolder)
                        .filter(file => !UNWANTED_FILES.includes(file))
                        .filter(file => file.endsWith('wav') || file.endsWith('mp3'))

  // filter out the voice overs
  const voiceOvers: VoiceOver[] = audioFiles
    .filter(file => file.startsWith('VO'))
    .map(vo => ({
      id: parseInt(vo.split('_')[1]),
      url: `file://${narrativesFolder}/${vo}`,
      name: (vo.substring(0, vo.lastIndexOf('.')).split('_')[2]).replace(/-/g, ' '),
      fileName: vo
    }))
    .sort((a, b) => a.id - b.id);

  // filter out the soundscapes
  const soundScapes: SoundScape[] = audioFiles
    .filter(file => file.startsWith('SC'))
    .map(sc => ({
      id: parseInt(sc.split('_')[1]),
      startsAt: parseInt(sc.split('_')[2]),
      url: `file://${narrativesFolder}/${sc}`,
      name: (sc.substring(0, sc.lastIndexOf('.')).split('_')[3]).replace(/-/g, ' '),
      fileName: sc
    }))

  // return the audio list
  return {
    VO: voiceOvers,
    SC: soundScapes
  }
}

/**
 * Creates a new recording folder and adds this to the internale AudioRecording
 * @returns
 */
export const createNewRecordingFolder = async (event: Electron.IpcMainInvokeEvent) => {
  // get the recording folder from settings
  const recordingsFolderSetting = await SettingHelper.getSetting('recordingsFolder');

  // if no recording folder, throw an exception
  if(!recordingsFolderSetting) {
    throw new Exception({
      message: "There was no recordings folder provided.",
      where: "createNewRecordingFolder"
    });
  }

  // create a new folder
  const folder = path.join(recordingsFolderSetting.value, Utils.generateUniqueNameByDate());
  if(!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
    AudioRecordingSingleton.getInstance().outDir = folder;
  }
}

/**
 * Start the recording
 * @param fileName
 */
export const startRecording = (event: Electron.IpcMainInvokeEvent, fileName?: string) => {
  AudioRecordingSingleton.getInstance().startRecording(fileName);
}

/**
 * Stop the recording
 */
export const stopRecording = () => {
  AudioRecordingSingleton.getInstance().stopRecording();
}