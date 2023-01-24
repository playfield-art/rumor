/**
 * In this file we wil store some functions to help us
 */

import fsExtra from "fs-extra";
import { join } from "path";
import SettingHelper from "./settings/SettingHelper";

/**
 * Create some empty folders in a folder
 * @param folderPath The path to create folders in
 * @param folders Array of folders
 */
export const createEmptyFolders = async (
  folderPath: string,
  folders: string[]
) => {
  await Promise.all(
    folders.map(async (folder) => fsExtra.mkdir(join(folderPath, folder)))
  );
};

/**
 * Move a folder to a different destination
 * @param folderPath The original folder
 * @param targetFolder The target folder
 */
export const moveFolder = async (folderPath: string, targetFolder: string) => {
  await fsExtra.move(folderPath, targetFolder);
};

/**
 * Get the recording folder path
 * @returns string
 */
export const getRecordingsFolder = async () =>
  (await SettingHelper.getSetting("recordingsFolder"))?.value || "";

/**
 * Get the archive folder path
 * @returns string
 */
export const getArchiveFolder = async () =>
  (await SettingHelper.getSetting("archiveFolder"))?.value || "";

/**
 * Get the narratives folder path
 * @returns string
 */
export const getNarrativesFolder = async () =>
  (await SettingHelper.getSetting("narrativesFolder"))?.value || "";
