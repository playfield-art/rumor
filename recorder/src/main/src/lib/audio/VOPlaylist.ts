import { VoiceOver } from "@shared/interfaces";
import player from "play-sound";
import { ChildProcess } from "child_process";
import { killProcess } from "../process/killProcess";

export interface VOPlaylistOptions {
  onNext?: (voiceOver: VoiceOver) => void;
  onVODone?: (voiceOver: VoiceOver) => void;
}

export default class VOPlaylist {
  private voiceOvers: VoiceOver[] = [];

  private currentIndex = -1;

  private internalPlayer;

  private currentAudio: ChildProcess;

  private options: VOPlaylistOptions = {
    onNext: () => {},
    onVODone: () => {},
  };

  constructor(voiceOvers: VoiceOver[], options?: VOPlaylistOptions) {
    this.voiceOvers = voiceOvers;
    this.currentIndex = -1;
    this.internalPlayer = player({ player: "afplay" });
    this.options = { ...this.options, ...options };
  }

  next() {
    // check if we have files to play
    if (this.voiceOvers.length === 0) throw new Error("No voiceovers found");

    // increment the current index
    this.currentIndex += 1;

    // if the index is bigger than the amount of voiceovers
    if (this.currentIndex >= this.voiceOvers.length) this.stop();
    // play next in line
    else {
      // get the voice over
      const voiceOver = this.voiceOvers[this.currentIndex];

      // trigger on next
      if (this.options.onNext) this.options.onNext(voiceOver);

      // check if we have a running process, if yes.. kill it
      if (this.currentAudio && !this.currentAudio.killed) {
        this.currentAudio.kill();
      }

      // play the voice over
      this.currentAudio = this.playVO(voiceOver);
    }
  }

  playVO(voiceOver: VoiceOver): ChildProcess {
    // play the voice over
    const childProcess = this.internalPlayer.play(voiceOver.url, (err) => {
      // whenever we have an error
      if (err && !err.killed) {
        console.error("Error occurrent in playing current audio.");
      }
    });

    // when closing the process, the process is done
    // exit code 0 is success, null is error
    childProcess.on("close", (code) => {
      if (code === 0 && this.options.onVODone) this.options.onVODone(voiceOver);
    });

    // return the audio child process
    return childProcess;
  }

  async stop() {
    // check if we have a running process, if yes.. kill it
    if (this.currentAudio && !this.currentAudio.killed) {
      this.currentAudio.kill();
    }

    // to be sure, kill everything like a terminator
    await killProcess("afplay");

    // set the current index back to -1
    this.currentIndex = -1;
  }
}
