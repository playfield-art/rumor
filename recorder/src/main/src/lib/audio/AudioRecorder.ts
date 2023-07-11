import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import { EventEmitter } from "events";

const defaultOptions: any = {
  program: "sox", // Which program to use, either `arecord`, `rec`, and `sox`.
  device: null, // Recording device to use.
  driver: null, // Recording driver to use.

  bits: 16, // Sample size. (only for `rec` and `sox`)
  channels: 1, // Channel count.
  encoding: "signed-integer", // Encoding type. (only for `rec` and `sox`)
  format: "S16_LE", // Format type. (only for `arecord`)
  rate: 48000, // Sample rate.
  type: "wav", // File type.

  // Following options only available when using `rec` or `sox`.
  silence: 60, // Duration of silence in seconds before it stops recording.
  thresholdStart: 0.5, // Silence threshold to start recording.
  thresholdStop: 0.5, // Silence threshold to stop recording.
  keepSilence: true, // Keep the silence in the recording.
};

export default class AudioRecorder extends EventEmitter {
  private _options;

  private _logger;

  private _command;

  private _childProcess: ChildProcessWithoutNullStreams | null;

  /**
   * Constructor of AudioRecord class.
   * @param {Object} options Object with optional options variables
   * @param {Object} logger Object with log, warn, and error functions
   * @returns {AudioRecorder} this
   */
  constructor(options: any, debug: boolean = false) {
    super();

    // the default options
    this._options = {
      ...defaultOptions,
      ...options,
    };

    // sets a logger if we are in debug mode
    if (debug) this._logger = console;

    // initialize the child process
    this._childProcess = null;

    // create the arguments for the sox command
    this._command = {
      arguments: [
        "-d", // Use the default recording device
        "-q", // Show no progress
        "-c", // Channel count
        this._options.channels.toString(),
        "-r", // Sample rate
        this._options.rate.toString(),
        "-t", // Format type
        this._options.type,
        "-V0", // Show no error messages
        "-b", // Bit rate
        this._options.bits.toString(),
        "-e", // Encoding type
        this._options.encoding,
        "-", // Pipe
      ],
      options: {
        encoding: "binary",
        env: { ...process.env },
      },
    };

    // If we have a logger, log the command.
    if (this._logger && debug) {
      // Log command.
      this._logger.log(
        `AudioRecorder: Command '${
          this._options.program
        } ${this._command.arguments.join(" ")}'; Options: AUDIODEV ${
          this._command.options.env.AUDIODEV
            ? this._command.options.env.AUDIODEV
            : "(default)"
        }, AUDIODRIVER: ${
          this._command.options.env.AUDIODRIVER
            ? this._command.options.env.AUDIODRIVER
            : "(default)"
        };`
      );
    }
  }

  /**
   * Check status if the recorder is recording
   */
  get isRecording() {
    return this._childProcess !== null;
  }

  /**
   * Creates and starts the audio recording process.
   * @returns {AudioRecorder} this
   */
  start() {
    if (this._childProcess) {
      if (this._logger) {
        this._logger.warn(
          "AudioRecorder: Process already active, killed old one started new process."
        );
      }
      this._childProcess.kill();
    }

    // Create new child process and give the recording commands.
    this._childProcess = spawn(
      this._options.program,
      this._command.arguments,
      this._command.options
    );

    // Store this in `self` so it can be accessed in the callback.
    const self = this;
    this._childProcess.on("close", (exitCode: number) => {
      if (self._logger) {
        if (exitCode !== 0)
          self._logger.log(`AudioRecorder: Exit code '${exitCode}'.`);
      }
      self.emit("close", exitCode);
    });
    this._childProcess.on("error", (error: any) => {
      console.log(error);
      self.emit("error", error);
    });
    this._childProcess.on("end", () => {
      self.emit("end");
    });

    if (this._logger) {
      this._logger.log("AudioRecorder: Started recording.");
    }

    return this;
  }

  /**
   * Stops and removes the audio recording process.
   * @returns {AudioRecorder} this
   */
  stop() {
    // if we don't have a child process, we can't stop it
    if (!this._childProcess) {
      if (this._logger) {
        this._logger.warn(
          "AudioRecorder: Unable to stop recording, no process active."
        );
      }
      return this;
    }

    this._childProcess.kill();
    this._childProcess = null;

    if (this._logger) {
      this._logger.log("AudioRecorder: Stopped recording.");
    }

    return this;
  }

  /**
   * Get the audio stream of the recording process.
   * @returns {Readable} The stream.
   */
  stream() {
    if (!this._childProcess) {
      if (this._logger) {
        this._logger.warn(
          "AudioRecorder: Unable to retrieve stream, because no process not active. Call the start or resume function first."
        );
      }
      return null;
    }

    return this._childProcess.stdout;
  }
}
