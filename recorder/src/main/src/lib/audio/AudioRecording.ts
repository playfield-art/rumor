import AudioRecorder from './AudioRecorder';
import * as fs from 'fs';
import * as path from 'path';
import { resourcesPath } from '@shared/resources';

const AudioRecordingOptions = {
  program: `${resourcesPath}/sox`, // Which program to use, either `arecord`, `rec`, or `sox`.
  device: null, // Recording device to use, e.g. `hw:1,0`

  bits: 16, // Sample size. (only for `rec` and `sox`)
  channels: 1, // Channel count.
  encoding: 'signed-integer', // Encoding type. (only for `rec` and `sox`)
  format: 'S16_LE', // Encoding type. (only for `arecord`)
  rate: 48000, // Sample rate.
  type: 'wav', // Format type.

  // Following options only available when using `rec` or `sox`.
  silence: 0, // Duration of silence in seconds before it stops recording.
  thresholdStart: 0.5, // Silence threshold to start recording.
  thresholdStop: 0.5, // Silence threshold to stop recording.
  keepSilence: true, // Keep the silence in the recording.
}

export interface AudioRecordingParams {
  outDir: string
}

export class AudioRecording {
  private _audioRecorder;
  private _debug = false;
  private _outDir;

  constructor({ outDir }: AudioRecordingParams) {
    this._outDir = outDir;
    this._audioRecorder = new AudioRecorder(AudioRecordingOptions, this._debug ? console : null);
    this._audioRecorder.on('error', this.onError);
    this._audioRecorder.on('end', this.onEnd);
  }

  set outDir(dir: string) {
    this._outDir = dir;
  }

  private onError() {
    if(this._debug) {
      console.warn('Recording error.');
    }
  }

  private onEnd() {
    if(this._debug) {
      console.warn('Recording ended.');
    }
  }

  startRecording(fileName?: string) {
    // Create the file path
    let filePath = path.join(
      this._outDir,
      fileName ? fileName : Math.random()
        .toString(36)
        .replace(/[^0-9a-zA-Z]+/g, '')
        .concat('.wav')
    );

    // Create write stream.
    const fileStream = fs.createWriteStream(filePath, { encoding: 'binary' });

    // Start and write to the file.
    this._audioRecorder?.start()?.stream()?.pipe(fileStream);
  }

  stopRecording() {
    this._audioRecorder.stop()
  }
}