import { AudioList, Narrative, RecordingMeta, SoundScape, VoiceOver, VoiceOverType } from "../../../shared/interfaces";
import fs from 'fs';
import { narrativeChapters, UNWANTED_FILES } from "../consts";
import SettingHelper from "../lib/settings/SettingHelper";
import path from 'path';
import { Utils } from '@shared/utils';
import { AudioRecordingSingleton } from "../lib/audio/AudioRecordingSingleton";
import { Exception } from "../lib/exceptions/Exception";

/**
 * Get the audiolist
 * @returns AudioList with VO and SC
 */
export const getAudioList = async (event: Electron.IpcMainInvokeEvent,
                                   language: string): Promise<AudioList> => {

  // get the narratives folder from settings
  const narrativesFolderSetting = await SettingHelper.getSetting('narrativesFolder');

  // defint the output
  const output:AudioList = { VO: [], SC: [] };

  // validate
  if(!narrativesFolderSetting) return output;

  // get the narratives folder
  const narrativesFolder = narrativesFolderSetting.value;

  // loop over every chapter and create the voice over list
  narrativeChapters.forEach((narrativeChapter) => {
    // define the absolute path of the chapter
    const chapterOptionsPath = `${narrativesFolder}/${narrativeChapter}Chapters`;

    // validate if the chapter options path exists
    if(!fs.existsSync(chapterOptionsPath)) return;

    // get the different options
    const chapterOptions = fs.readdirSync(chapterOptionsPath)
                             .filter(file => !UNWANTED_FILES.includes(file));

    // validate
    if(!(chapterOptions.length > 0)) return;

    // get a random option
    const randomChapterOption = chapterOptions[Math.floor(Math.random() * chapterOptions.length)];

    // get the random option path
    const randomChapterOptionPath = `${chapterOptionsPath}/${randomChapterOption}/`;

    // read all the files in the option
    const randomChapterOptionAudioFiles = fs.readdirSync(randomChapterOptionPath)
                                            .filter(file => !UNWANTED_FILES.includes(file))
                                            .filter((f) => f.startsWith(language));

    // create the voice overs
    const voiceOvers: VoiceOver[] = randomChapterOptionAudioFiles
      .map((audioFile) => {
        const audioFileSplitted = audioFile.substring(0, audioFile.lastIndexOf('.')).split('-');
        return {
          fileName: audioFile,
          language: audioFileSplitted[0],
          order: parseInt(audioFileSplitted[1]),
          type: audioFileSplitted[2] === "QU" ? VoiceOverType.Question : VoiceOverType.VoiceOver,
          id: parseInt(audioFileSplitted[3]),
          chapter: narrativeChapter,
          url: `file://${randomChapterOptionPath}${audioFile}`,
        }
      })
      .sort((a, b) => a.order - b.order);

    // add the voice overs to our output
    output.VO = [ ...output.VO, ...voiceOvers ];

    // do we have a soundscape?
    const randomChapterOptionSoundscapeFiles = fs.readdirSync(randomChapterOptionPath)
                                                 .filter(file => !UNWANTED_FILES.includes(file))
                                                 .filter((f) => f.startsWith('soundscape'));
    if(randomChapterOptionSoundscapeFiles.length > 0) {
      output.SC.push({
        fileName: randomChapterOptionSoundscapeFiles[0],
        startsAt: voiceOvers[0],
        url: `file://${randomChapterOptionPath}${randomChapterOptionSoundscapeFiles[0]}`,
      })
    }
  })

  // return the audio list
  return output;
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

  // generate a session id
  const recordingMeta: RecordingMeta = {
    boothId: 'ru1',
    sessionId: Utils.generateUniqueNameByDate(),
    recordingDate: Utils.currentDate(),
    recordingTime: Utils.currentTime(),
  }

  // create a new folder
  const folder = path.join(recordingsFolderSetting.value, recordingMeta.sessionId);
  if(!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
    AudioRecordingSingleton.getInstance().outDir = folder;
  }

  // add some meta information to the folder
  fs.writeFileSync(`${folder}/meta.json`, JSON.stringify(recordingMeta))
}

/**
 * Start the recording
 * @param fileName
 */
export const startRecording = (event: Electron.IpcMainInvokeEvent, language: string, id: number) => {
  AudioRecordingSingleton.getInstance().startRecording(language, id);
}

/**
 * Stop the recording
 */
export const stopRecording = () => {
  AudioRecordingSingleton.getInstance().stopRecording();
}