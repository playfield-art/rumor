import { AudioList, VoiceOverType } from "@shared/interfaces";

import VOPlaylist, { VOPlaylistOptions } from "./VOPlaylist";
import { AudioRecordingSingleton } from "./AudioRecordingSingleton";
import SCPlaylist from "./SCPlaylist";
import { Recorder } from "../../recorder";

export default class SoundBoard {
  public static VOPlaylist: VOPlaylist;

  public static SCPlaylist: SCPlaylist;

  public static initPlaylist(audioList: AudioList) {
    // define the options needed for our playlist
    const voPlaylistOptions: VOPlaylistOptions = {
      onNext: (voiceOver) => {
        // stop the recording if it is recording
        if (AudioRecordingSingleton.getInstance().isRecording) {
          AudioRecordingSingleton.getInstance().stopRecording();
        }

        // get the soundscape corresponding to the voice over
        const soundscape =
          SoundBoard.SCPlaylist.getSCCorrespondingToVoiceOver(voiceOver);
        if (soundscape) {
          console.log("====================================");
          console.log("play-soundscape", soundscape);
          console.log("====================================");
          Recorder.mainWindow.webContents.send("play-soundscape", soundscape);
        }
      },
      onVODone: (voiceOver) => {
        if (voiceOver.type === VoiceOverType.VoiceOver) {
          SoundBoard.VOPlaylist.next();
        } else if (voiceOver.type === VoiceOverType.Question) {
          AudioRecordingSingleton.getInstance().startRecording(
            voiceOver.language,
            voiceOver.id
          );
        }
      },
    };

    // create new voice over playlist
    SoundBoard.VOPlaylist = new VOPlaylist(audioList.VO, voPlaylistOptions);
    SoundBoard.SCPlaylist = new SCPlaylist(audioList.SC);
  }

  public static async destroy() {
    if (SoundBoard.VOPlaylist) {
      await SoundBoard.VOPlaylist.stop();
    }
  }
}
