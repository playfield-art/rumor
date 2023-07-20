import fs from "fs";
import path from "path";
import {
  AudioList,
  RecordingMeta,
  SoundScape,
  VoiceOver,
  VoiceOverType,
} from "@shared/interfaces";
import { Utils } from "@shared/utils";
import { Exception } from "../exceptions/Exception";
import VOPlaylist, { VOPlaylistOptions } from "./VOPlaylist";
import { AudioRecordingSingleton } from "./AudioRecordingSingleton";
import SCPlaylist from "./SCPlaylist";
import { getAudioList as getAudioListHelper } from "./AudioList";
import Logger from "../logging/Logger";
import SettingHelper from "../settings/SettingHelper";
import { getRecordingsFolder } from "../filesystem";

export default class SoundBoard {
  private static VOPlaylist: VOPlaylist;

  private static SCPlaylist: SCPlaylist;

  public static sessionRunning: boolean = false;

  /**
   * Create a new session in the soundboard
   * @returns The audio list
   */
  private static createNewSession = async () => {
    // get the language
    const language = await SettingHelper.getLanguage();

    // create new audiolist
    const audioList = await getAudioListHelper(language);

    // get the recording folder from settings
    const recordingsFolder = await getRecordingsFolder();

    // get the booth slug
    const boothSlug = await SettingHelper.getBoothSlug();

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

    // log out the new session
    Logger.info(`Created new session: ${recordingMeta.sessionId}`);

    // return the audio list to work with
    return audioList;
  };

  /**
   * Destroy the soundboard
   * 1. Stop the recording if it is recording
   * 2. Stop the playlist
   * 3. Ask the frontend to cleanup the soundscape
   */
  public static async destroy() {
    // stop the recording if it is recording
    if (AudioRecordingSingleton.getInstance().isRecording) {
      await AudioRecordingSingleton.getInstance().stopRecording();
    }

    // stop the playlist
    if (SoundBoard.VOPlaylist) {
      await SoundBoard.VOPlaylist.stop();
    }

    // set the inner state
    SoundBoard.sessionRunning = false;
  }

  /**
   * Init the playlist with the given audio list
   * @param audioList The audio list to init the playlist with
   */
  public static initPlaylist(
    audioList: AudioList,
    onTriggerSoundscape?: (soundscape: SoundScape) => void
  ) {
    // define the options needed for our playlist
    const voPlaylistOptions: VOPlaylistOptions = {
      onNext: (voiceOver: VoiceOver) => {
        // do something when we are the next voice over
        SoundBoard.onNextInPLaylist();

        // if we have a trigger event defined
        if (onTriggerSoundscape) {
          // get the soundscape corresponding to the voice over
          const soundscape =
            SoundBoard.SCPlaylist.getSCCorrespondingToVoiceOver(voiceOver);

          // if we have a soundscape, send it to the renderer
          if (soundscape) {
            onTriggerSoundscape(soundscape);
            Logger.info(`Playing soundscape ${soundscape.fileName}`);
          }
        }
      },
      onVODone: this.onVODone,
    };

    // create new voice over playlist
    SoundBoard.VOPlaylist = new VOPlaylist(audioList.VO, voPlaylistOptions);
    SoundBoard.SCPlaylist = new SCPlaylist(audioList.SC);
  }

  /**
   * On next voice over in playlist
   * @param voiceOver
   */
  private static async onNextInPLaylist() {
    // stop the recording if it is recording
    if (AudioRecordingSingleton.getInstance().isRecording) {
      const stats = await AudioRecordingSingleton.getInstance().stopRecording();
      Logger.info(`Stopped recording, the filesize is ${stats.sizeReadable}`);
    }
  }

  /**
   * Play the next voice over
   */
  public static async next() {
    if (this.sessionRunning && SoundBoard.VOPlaylist) {
      SoundBoard.VOPlaylist.next();
    } else {
      Logger.error("Can't play next, no session is running.");
    }
  }

  /**
   * Whenever a voice over is done
   * @param voiceOver The voice over that is done
   */
  private static onVODone(voiceOver: VoiceOver) {
    if (voiceOver.type === VoiceOverType.VoiceOver) {
      // play the next voice over
      SoundBoard.VOPlaylist.next();
    } else if (voiceOver.type === VoiceOverType.Question) {
      // start the recording
      const filePath = AudioRecordingSingleton.getInstance().startRecording(
        voiceOver.language,
        voiceOver.id
      );

      // log the filepath to where the recording is saved
      Logger.info(`Started recording: ${filePath}`);
    }
  }

  /**
   * Start a new session
   */
  public static async startSession(
    onTriggerSoundscape?: (soundscape: SoundScape) => void
  ) {
    if (!SoundBoard.sessionRunning) {
      // create a new session
      const audioList = await SoundBoard.createNewSession();

      // init the playlist
      SoundBoard.initPlaylist(audioList, onTriggerSoundscape);

      // start the playlist
      SoundBoard.VOPlaylist.next();

      // set inner state
      SoundBoard.sessionRunning = true;
    }
  }
}
