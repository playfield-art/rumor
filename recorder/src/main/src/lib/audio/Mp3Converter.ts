import { resourcesPath } from "@shared/resources";
import { Mp3Conversion } from "./Mp3Conversion";

export class Mp3Converter {
  public static async convert(filePaths: string[]) {
    const mp3Conversion = new Mp3Conversion(filePaths, {
      program: `${resourcesPath}/ffmpeg`,
    });
    await mp3Conversion.startConversion();
  }
}
