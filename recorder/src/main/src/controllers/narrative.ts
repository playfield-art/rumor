import { ChapterOption, LocalNarrative } from "@shared/interfaces";
import { Exception } from "../lib/exceptions/Exception";
import { getLocalNarrative as gln } from "../lib/narrative/LocalNarrativeHelper";
import SettingHelper from "../lib/settings/SettingHelper";

/**
 * Gets the local narrative (based on the files and folders in the narratives folder)
 * @returns The local narrative
 */
export const getLocalNarrative = async (): Promise<LocalNarrative> => {
  try {
    return await gln();
  } catch (e: any) {
    throw new Exception({ where: "getLocalNarrative", message: e.message });
  }
};

/**
 * Gets the selected chapter options
 */
export const getSelectedChapterOptionId = async (
  event: Electron.IpcMainInvokeEvent,
  chapter: string
): Promise<string> => {
  try {
    return await SettingHelper.getSelectedChapterOptionId(chapter);
  } catch (e: any) {
    throw new Exception({
      where: "getSelectedChapterOptionId",
      message: e.message,
    });
  }
};

/**
 * Set the selected chapter option
 * @param chapter The chapter
 * @param option The option
 */
export const setSelectedChapterOptionId = async (
  event: Electron.IpcMainInvokeEvent,
  chapterOption: ChapterOption
): Promise<void> => {
  try {
    return await SettingHelper.setSelectedChapterOption(chapterOption);
  } catch (e: any) {
    throw new Exception({
      where: "setSelectedChapterOptionId",
      message: e.message,
    });
  }
};
