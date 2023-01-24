import {
  AudioList,
  ChapterMeta,
  VoiceOverType,
  VoiceOver,
} from "@shared/interfaces";
import fs from "fs";
import { UNWANTED_FILES, narrativeChapters } from "../../consts";
import SettingHelper from "../settings/SettingHelper";

/**
 * Gets a random audio list for the narrative
 * @param language
 * @returns
 */
export const getAudioList = async (language: string) => {
  // get the narratives folder from settings
  const narrativesFolderSetting = await SettingHelper.getSetting(
    "narrativesFolder"
  );

  // defint the output
  const output: AudioList = { VO: [], SC: [], chapters: [] };

  // validate
  if (!narrativesFolderSetting) return output;

  // get the narratives folder
  const narrativesFolder = narrativesFolderSetting.value;

  // loop over every chapter and create the voice over list
  narrativeChapters.forEach((narrativeChapter) => {
    // define the absolute path of the chapter
    const chapterOptionsPath = `${narrativesFolder}/${narrativeChapter}Chapters`;

    // validate if the chapter options path exists
    if (!fs.existsSync(chapterOptionsPath)) return;

    // get the different options
    const chapterOptions = fs
      .readdirSync(chapterOptionsPath)
      .filter((file) => !UNWANTED_FILES.includes(file));

    // validate
    if (!(chapterOptions.length > 0)) return;

    // get a random option
    const randomChapterOption =
      chapterOptions[Math.floor(Math.random() * chapterOptions.length)];

    // get the random option path
    const randomChapterOptionPath = `${chapterOptionsPath}/${randomChapterOption}/`;

    // adding chapter meta
    output.chapters.push(
      JSON.parse(
        fs.readFileSync(`${randomChapterOptionPath}/meta.json`, "utf-8")
      ) as ChapterMeta
    );

    // read all the files in the option
    const randomChapterOptionAudioFiles = fs
      .readdirSync(randomChapterOptionPath)
      .filter((file) => !UNWANTED_FILES.includes(file))
      .filter((f) => f.startsWith(language));

    // create the voice overs
    const voiceOvers: VoiceOver[] = randomChapterOptionAudioFiles
      .map((audioFile) => {
        const audioFileSplitted = audioFile
          .substring(0, audioFile.lastIndexOf("."))
          .split("-");
        return {
          fileName: audioFile,
          language: audioFileSplitted[0],
          order: parseInt(audioFileSplitted[1]),
          type:
            audioFileSplitted[2] === "QU"
              ? VoiceOverType.Question
              : VoiceOverType.VoiceOver,
          id: parseInt(audioFileSplitted[3]),
          chapter: narrativeChapter,
          url: `file://${randomChapterOptionPath}${audioFile}`,
        };
      })
      .sort((a, b) => a.order - b.order);

    // add the voice overs to our output
    output.VO = [...output.VO, ...voiceOvers];

    // do we have a soundscape?
    const randomChapterOptionSoundscapeFiles = fs
      .readdirSync(randomChapterOptionPath)
      .filter((file) => !UNWANTED_FILES.includes(file))
      .filter((f) => f.startsWith("soundscape"));
    if (randomChapterOptionSoundscapeFiles.length > 0) {
      output.SC.push({
        fileName: randomChapterOptionSoundscapeFiles[0],
        startsAt: voiceOvers[0],
        url: `file://${randomChapterOptionPath}${randomChapterOptionSoundscapeFiles[0]}`,
      });
    }
  });

  // return the audio list
  return output;
};
