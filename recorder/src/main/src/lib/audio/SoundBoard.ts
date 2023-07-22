import fs from "fs";
import path from "path";
import {
  AudioList,
  RecordingMeta,
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
import { Recorder } from "../../recorder";

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
   */
  public static async destroy() {
    // set the inner state
    SoundBoard.sessionRunning = false;

    // stop the recording if it is recording
    if (AudioRecordingSingleton.getInstance().isRecording) {
      const stats = await AudioRecordingSingleton.getInstance().stopRecording();
      Logger.info(`Stopped recording, the filesize is ${stats.sizeReadable}`);
    }

    // stop the playlist
    if (SoundBoard.VOPlaylist && !SoundBoard.VOPlaylist.stopped) {
      await SoundBoard.VOPlaylist.stop();
    }
  }

  /**
   * Destroy the soundboard
   * 1. Stop the recording if it is recording
   * 2. Stop the playlist
   * 3. Ask the frontend to cleanup the soundscape
   */
  public static async stopSession() {
    // destroy the soundboard
    await SoundBoard.destroy();

    // let the frontend know and ask to cleanup the soundscape
    Recorder.mainWindow.webContents.send("session-stopped");
  }

  /**
   * Init the playlist with the given audio list
   * @param audioList The audio list to init the playlist with
   */
  public static initPlaylist(audioList: AudioList) {
    // define the options needed for our playlist
    const voPlaylistOptions: VOPlaylistOptions = {
      onNext: async (voiceOver: VoiceOver) => {
        /**
         * RECORDING - Stop recording if it is recording
         */
        if (AudioRecordingSingleton.getInstance().isRecording) {
          const stats =
            await AudioRecordingSingleton.getInstance().stopRecording();
          Logger.info(
            `Stopped recording, the filesize is ${stats.sizeReadable}`
          );
        }

        /**
         * SOUNDSCAPE - Get the soundscape corresponding to the voice over
         */
        const soundscape =
          SoundBoard.SCPlaylist.getSCCorrespondingToVoiceOver(voiceOver);

        // if we have a soundscape, send it to the renderer
        if (soundscape) {
          Recorder.mainWindow.webContents.send("play-soundscape", soundscape);
          Logger.info(`Trigger soundscape ${soundscape.fileName}`);
        }

        /**
         * VOICE OVER - if we have a next voice over, let the frontend know
         */
        Recorder.mainWindow.webContents.send("next-vo", voiceOver);
      },
      onVODone: this.onVODone,
      onPlaylistDone: this.onPlaylistDone,
    };

    // create new voice over playlist
    SoundBoard.VOPlaylist = new VOPlaylist(audioList.VO, voPlaylistOptions);
    SoundBoard.SCPlaylist = new SCPlaylist(audioList.SC);
  }

  /**
   * Play the next voice over
   */
  public static next() {
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
   * Whenever the playlist is stopped
   */
  private static async onPlaylistDone() {
    // stop the session
    await SoundBoard.stopSession();

    // log
    Logger.success("Session done!");
  }

  /**
   * Start a new session
   */
  public static async startSession() {
    if (!SoundBoard.sessionRunning) {
      // create a new session
      const audioList = await SoundBoard.createNewSession();

      // init the playlist
      SoundBoard.initPlaylist(audioList);

      // start the playlist
      SoundBoard.next();

      // set inner state
      SoundBoard.sessionRunning = true;

      // let the frontend know
      Recorder.mainWindow.webContents.send("session-started");
    }
  }
}
