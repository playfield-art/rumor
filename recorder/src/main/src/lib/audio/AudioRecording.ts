import * as fs from "fs";
import * as path from "path";
import { resourcesPath } from "@shared/resources";
import { Utils } from "@shared/utils";
import AudioRecorder from "./AudioRecorder";
import { UNWANTED_FILES } from "../../consts";
import { killProcess } from "../process/killProcess";

const AudioRecordingOptions = {
  program: `${resourcesPath}/sox`, // Which program to use, either `arecord`, `rec`, or `sox`.
  device: null, // Recording device to use, e.g. `hw:1,0`

  bits: 16, // Sample size. (only for `rec` and `sox`)
  channels: 1, // Channel count.
  encoding: "signed-integer", // Encoding type. (only for `rec` and `sox`)
  format: "S16_LE", // Encoding type. (only for `arecord`)
  rate: 48000, // Sample rate.
  type: "wav", // Format type.

  // Following options only available when using `rec` or `sox`.
  silence: 0, // Duration of silence in seconds before it stops recording.
  thresholdStart: 0.5, // Silence threshold to start recording.
  thresholdStop: 0.5, // Silence threshold to stop recording.
  keepSilence: true, // Keep the silence in the recording.
};

export interface AudioRecordingParams {
  outDir: string;
}

export interface AudioRecordingStats {
  bytes: number;
  sizeReadable: string;
  filePath: string;
}

export class AudioRecording {
  private _audioRecorder;

  private _debug = false;

  private _outDir;

  private _currentRecordingFilePath: string;

  constructor({ outDir }: AudioRecordingParams) {
    this._outDir = outDir;
    this._audioRecorder = new AudioRecorder(AudioRecordingOptions, this._debug);
    this._audioRecorder.on("error", this.onError);
    this._audioRecorder.on("end", this.onEnd);
  }

  set outDir(dir: string) {
    this._outDir = dir;
  }

  get isRecording() {
    return this._audioRecorder.isRecording;
  }

  private onError() {
    if (this._debug) {
      console.warn("Recording error.");
    }
  }

  private onEnd() {
    if (this._debug) {
      console.warn("Recording ended.");
    }
  }

  /**
   * Start the recording and ID of the question
   * @param language The language to record
   * @param id The id of the recording
   * @returns The file path of the recording
   */
  startRecording(language: string, id: number): string {
    // get the current order number (new recordings wil get a new number)
    const recordedFiles = fs
      .readdirSync(this._outDir)
      .filter((f) => !UNWANTED_FILES.includes(f))
      .filter((f) => f.startsWith(language));

    // validate and get the max order
    let maxOrder = 0;
    if (recordedFiles.length > 0) {
      maxOrder = Math.max(
        ...recordedFiles.map((f) => parseInt(f.split("-")[1]))
      );
    }

    // const file name
    const fileName = `${language}-${(maxOrder += 1)}-${id}.wav`;

    // create the file path
    const filePath = path.join(this._outDir, fileName);

    // create write stream.
    const fileStream = fs.createWriteStream(filePath, { encoding: "binary" });

    // start and write to the file.
    this._audioRecorder?.start()?.stream()?.pipe(fileStream);

    // set the current recording file path
    this._currentRecordingFilePath = filePath;

    // return the file path
    return this._currentRecordingFilePath;
  }

  async stopRecording(): Promise<AudioRecordingStats> {
    // stop the audio recorder
    this._audioRecorder.stop();

    // kill all sox processes running on the system
    await killProcess("sox");

    // small delay until stream is closed
    await Utils.delay(500);

    // output
    let stats: AudioRecordingStats = {
      filePath: "",
      sizeReadable: "",
      bytes: 0,
    };

    // if we have a recording path
    if (this._currentRecordingFilePath) {
      const bytes = fs.statSync(this._currentRecordingFilePath).size;
      stats = {
        filePath: this._currentRecordingFilePath,
        bytes,
        sizeReadable: Utils.formatBytes(bytes, 2),
      };
    }

    // return the stats
    return stats;
  }
}
