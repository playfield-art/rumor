import { spawn } from "child_process";
import path from "path";

export interface Mp3ConversionOptions {
  program?: string;
  sampleRate?: "48000" | "44100" | "22050" | "11025" | "8000"; // rate set audio sampling rate (in Hz)
  channels?: number; // channels set number of audio channels
  bitRate?: "192k" | "128k"; // bitRate set the bitrate of the encoded audio file (in kbps)
}

const defaultOptions: Mp3ConversionOptions = {
  program: "ffmpeg",
  sampleRate: "48000",
  channels: 2,
  bitRate: "192k",
};

export class Mp3Conversion {
  private filePaths: string[];

  private options: Mp3ConversionOptions;

  constructor(filePaths: string[], options: Mp3ConversionOptions) {
    this.filePaths = filePaths;
    this.options = { ...defaultOptions, ...options };
  }

  /**
   * Get all the arguments for the ffmpeg command.
   * @param filePath The path to the file to convert
   * @returns The arguments for the ffmpeg command
   */
  private getArguments = (filePath: string): string[] =>
    // create the arguments for the sox command
    [
      "-y", // overwrite output files
      "-i", // input file
      filePath,
      "-vn", // disable video
      "-ar", // sample rate
      this.options.sampleRate?.toString() ??
        (defaultOptions.sampleRate || "48000"),
      "-ac", // channels
      this.options.channels?.toString() ??
        (defaultOptions.channels || 2).toString(),
      "-b:a", // bitrate
      this.options.bitRate?.toString() ?? (defaultOptions.bitRate || "192k"),
      `${path.dirname(filePath)}/${path.parse(filePath).name}.mp3`, // output file
    ];

  /**
   * Convert a file to mp3
   * @param filePath
   */
  private async convert(filePath: string) {
    return new Promise((resolve, reject) => {
      try {
        // get the arguments for the ffmpeg command
        const args = this.getArguments(filePath);

        // create new child process and give the conversion commands.
        const childProcess = spawn(
          this.options.program ?? (defaultOptions.program || "ffmpeg"),
          args,
          {
            env: { ...process.env },
          }
        );

        // event handler for the conversion process
        childProcess.on("close", (exitCode: number) => {
          if (exitCode !== 0) reject(new Error(`Exit code '${exitCode}'.`));
          else {
            resolve("done");
          }
        });

        childProcess.on("error", (error: any) => {
          console.log(error.message);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Start the conversion of the files
   */
  public startConversion: () => Promise<void> = async () => {
    await Promise.all(this.filePaths.map((filePath) => this.convert(filePath)));
  };
}
