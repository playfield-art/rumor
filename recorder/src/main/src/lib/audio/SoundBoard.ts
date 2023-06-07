import { AudioList, VoiceOverType } from "@shared/interfaces";

import VOPlaylist, { VOPlaylistOptions } from "./VOPlaylist";
import { AudioRecordingSingleton } from "./AudioRecordingSingleton";
import SCPlaylist, { SCPlaylistOptions } from "./SCPlaylist";
import { Recorder } from "../../recorder";

export default class SoundBoard {
  public static VOPlaylist: VOPlaylist;

  public static SCPlaylist: SCPlaylist;

  public static initPlaylist(audioList: AudioList) {
    // define the options needed for our playlist
    const voPlaylistOptions: VOPlaylistOptions = {
      onNext: (voiceOver) => {
        if (AudioRecordingSingleton.getInstance().isRecording) {
          AudioRecordingSingleton.getInstance().stopRecording();
        }
        SoundBoard.SCPlaylist.triggerNextWhenVoiceOverDone(voiceOver);
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

    // define the options needed for our soundscape playlist
    const scPlaylistOptions: SCPlaylistOptions = {
      onNext: (soundscape) => {
        console.log("====================================");
        console.log("play-soundscape", soundscape);
        console.log("====================================");
        Recorder.mainWindow.webContents.send("play-soundscape", soundscape);
      },
    };

    // create new playlist
    SoundBoard.VOPlaylist = new VOPlaylist(audioList.VO, voPlaylistOptions);
    SoundBoard.SCPlaylist = new SCPlaylist(audioList.SC, scPlaylistOptions);
  }

  public static destroy() {
    if (SoundBoard.VOPlaylist) {
      SoundBoard.VOPlaylist.stop();
    }
  }
}
