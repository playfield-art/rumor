import { AudioList, VoiceOver, VoiceOverType } from "@shared/interfaces";

import VOPlaylist, { VOPlaylistOptions } from "./VOPlaylist";
import { AudioRecordingSingleton } from "./AudioRecordingSingleton";
import SCPlaylist from "./SCPlaylist";
import { Recorder } from "../../recorder";
import Logger from "../logging/Logger";

export default class SoundBoard {
  public static VOPlaylist: VOPlaylist;

  public static SCPlaylist: SCPlaylist;

  /**
   * On next voice over in playlist
   * @param voiceOver
   */
  private static async onNextInPLaylist(voiceOver: VoiceOver) {
    // stop the recording if it is recording
    if (AudioRecordingSingleton.getInstance().isRecording) {
      const stats = await AudioRecordingSingleton.getInstance().stopRecording();
      Logger.info(`Stopped recording, the filesize is ${stats.sizeReadable}`);
    }

    // get the soundscape corresponding to the voice over
    const soundscape =
      SoundBoard.SCPlaylist.getSCCorrespondingToVoiceOver(voiceOver);

    // if we have a soundscape, send it to the renderer
    if (soundscape) {
      Recorder.mainWindow.webContents.send("play-soundscape", soundscape);
      Logger.info(`Playing soundscape ${soundscape.fileName}`);
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
   * Init the playlist with the given audio list
   * @param audioList The audio list to init the playlist with
   */
  public static initPlaylist(audioList: AudioList) {
    // define the options needed for our playlist
    const voPlaylistOptions: VOPlaylistOptions = {
      onNext: this.onNextInPLaylist,
      onVODone: this.onVODone,
    };

    // create new voice over playlist
    SoundBoard.VOPlaylist = new VOPlaylist(audioList.VO, voPlaylistOptions);
    SoundBoard.SCPlaylist = new SCPlaylist(audioList.SC);
  }

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

    // ask the frontend to cleanup the soundscape
    Recorder.mainWindow.webContents.send("cleanup-soundscape");
  }
}
