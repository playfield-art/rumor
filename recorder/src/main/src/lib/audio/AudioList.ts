import fs from "fs";
import {
  AudioList,
  ChapterMeta,
  VoiceOverType,
  VoiceOver,
  SoundScape,
} from "@shared/interfaces";
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

  // get the selected chapter options
  const savedSelectedChapterOptions =
    await SettingHelper.getSelectedChapterOptions();

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
    // @todo chapter based on the chapter selected in backend
    const savedSelectedChapterOption = savedSelectedChapterOptions.find(
      (x) => x.chapter === narrativeChapter
    );

    // define the selected chapter option
    let selectedChapterOption: string;

    // if there is no saved selected chapter option, or the option is random, get a random option
    if (
      !savedSelectedChapterOption ||
      savedSelectedChapterOption.optionId === "random"
    ) {
      selectedChapterOption =
        chapterOptions[Math.floor(Math.random() * chapterOptions.length)];
    }

    // else get the saved selected chapter option
    else {
      selectedChapterOption = savedSelectedChapterOption.optionId;
    }

    // get the random option path
    const selectedChapterOptionPath = `${chapterOptionsPath}/${selectedChapterOption}/`;

    // adding chapter meta
    output.chapters.push(
      JSON.parse(
        fs.readFileSync(`${selectedChapterOptionPath}meta.json`, "utf-8")
      ) as ChapterMeta
    );

    /**
     * Voice Overs and Questions
     */

    // read all the files in the option
    const selectedChapterOptionAudioFiles = fs
      .readdirSync(selectedChapterOptionPath)
      .filter((file) => !UNWANTED_FILES.includes(file))
      .filter((f) => f.startsWith(language));

    // create the voice overs
    const voiceOvers: VoiceOver[] = selectedChapterOptionAudioFiles
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
          url: `${selectedChapterOptionPath}${audioFile}`,
        };
      })
      .sort((a, b) => a.order - b.order);

    // add the voice overs to our output
    output.VO = [...output.VO, ...voiceOvers];

    /**
     * Soundscapes
     */

    // read all the soundscapes in the chapter folder
    const selectedChapterOptionSoundscapeFiles = fs
      .readdirSync(selectedChapterOptionPath)
      .filter((file) => !UNWANTED_FILES.includes(file))
      .filter((f) => f.startsWith("sc"));

    // create the soundscapes
    const soundscapes: SoundScape[] = selectedChapterOptionSoundscapeFiles.map(
      (soundscapeFile) => {
        const soundscapeFileSplitted = soundscapeFile
          .substring(0, soundscapeFile.lastIndexOf("."))
          .split("-");

        return {
          fileName: soundscapeFile,
          startsAt:
            voiceOvers.find(
              (vo) =>
                vo.order === parseInt(soundscapeFileSplitted[1]) &&
                vo.id === parseInt(soundscapeFileSplitted[2])
            ) ?? voiceOvers[0],
          url: `file://${selectedChapterOptionPath}${soundscapeFile}`,
        };
      }
    );

    // add the soundscapes to our output
    output.SC = [...output.SC, ...soundscapes];
  });

  // return the audio list
  return output;
};
