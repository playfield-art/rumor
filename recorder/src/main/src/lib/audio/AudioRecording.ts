import AudioRecorder from './AudioRecorder';
import * as fs from 'fs';
import * as path from 'path';
import { resourcesPath } from '@shared/resources';
import { UNWANTED_FILES } from '../../consts';

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

  startRecording(language: string = 'nl', id: number) {
    // get the current order number (new recordings wil get a new number)
    const recordedFiles = fs.readdirSync(this._outDir)
                 .filter(f => !UNWANTED_FILES.includes(f))
                 .filter(f => f.startsWith(language));

    // validate and get the max order
    let maxOrder = 0;
    if(recordedFiles.length > 0) {
      maxOrder = Math.max(...recordedFiles.map(f => parseInt(f.split('-')[1])));
    }

    // create the file path
    let filePath = path.join(this._outDir, `${language}-${maxOrder++}-${id}.wav`);

    // create write stream.
    const fileStream = fs.createWriteStream(filePath, { encoding: 'binary' });

    // start and write to the file.
    this._audioRecorder?.start()?.stream()?.pipe(fileStream);
  }

  stopRecording() {
    this._audioRecorder.stop()
  }
}