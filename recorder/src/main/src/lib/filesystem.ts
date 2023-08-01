/* eslint-disable no-restricted-syntax */
/**
 * In this file we wil store some functions to help us
 */

import { join } from "path";
import fsExtra from "fs-extra";
import SettingHelper from "./settings/SettingHelper";
import { UNWANTED_FILES } from "../consts";

interface FolderInfo {
  path: string;
  createdAt: Date;
  size: number;
}

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
 * Calcualte the folder size
 * @param folderPath The folder path
 * @returns
 */
export const calculateFolderSizeInMB = (folderPath: string) => {
  // get a list of all the folders
  const files = fsExtra
    .readdirSync(folderPath)
    .filter((file) => !UNWANTED_FILES.includes(file));

  // calculate the total size
  const totalSize = files.reduce((acc, file) => {
    const filePath = join(folderPath, file);
    const stat = fsExtra.statSync(filePath);
    return acc + stat.size;
  }, 0);

  // convert tot MB
  return totalSize / 1024 / 1024;
};

/**
 * Get the creation tile of a folder
 * @param folderPath The path to the folder
 * @returns The creation time
 */
const getFolderCreationTime = (folderPath: string): Date => {
  const stat = fsExtra.statSync(folderPath);
  return stat.birthtime;
};

/**
 * Get the size of a folder
 * @param folderPath The path to the folder
 * @returns Number of MB
 */
const getFolderSize = (folderPath: string): number => {
  const stat = fsExtra.statSync(folderPath);

  if (stat.isDirectory()) {
    // init the total size
    let totalSize = 0;

    // the file entries
    const entries = fsExtra
      .readdirSync(folderPath)
      .filter((file) => !UNWANTED_FILES.includes(file));

    // calculate the total size
    for (const entry of entries) {
      const entryPath = join(folderPath, entry);
      totalSize += getFolderSize(entryPath);
    }

    // return the total size
    return totalSize;
  }
  return stat.size;
};

/**
 * Delete folders to reduce the size
 * @param folderPath The path to the folder
 * @param targetSize The target size
 */
const deleteSubfoldersToReduceSize = (
  folderPath: string,
  targetSize: number
): number => {
  const folderInfoList: FolderInfo[] = [];
  const entries = fsExtra
    .readdirSync(folderPath)
    .filter((file) => !UNWANTED_FILES.includes(file));

  // get all the file info
  for (const entry of entries) {
    const entryPath = join(folderPath, entry);
    // eslint-disable-next-line no-await-in-loop
    const createdAt = getFolderCreationTime(entryPath);
    const size = getFolderSize(entryPath) / 1024 / 1024;
    folderInfoList.push({ path: entryPath, createdAt, size });
  }

  // sort subfolders by creation time in ascending order (oldest first)
  folderInfoList.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  // get the total size
  const totalSize = folderInfoList.reduce(
    (acc, folderInfo) => acc + folderInfo.size,
    0
  );

  // calculate how much we need to delete
  let sizeToDelete = totalSize - targetSize;

  // the amount of deleted files
  let deletedFiles = 0;

  // loop over the folders and delete them
  for (const folderInfo of folderInfoList) {
    if (sizeToDelete <= 0) break;
    fsExtra.removeSync(folderInfo.path);
    sizeToDelete -= folderInfo.size;
    deletedFiles += 1;
  }

  return deletedFiles;
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

/**
 * Make the archive folder size safe
 */
export const makeArchiveFolderSizeSafe = async (
  maxSize: number,
  makeSize: number
): Promise<{ originalArchiveFolderSize: number; deletedFolders: number }> => {
  if (makeSize > maxSize) throw new Error("Make size is bigger than max size");

  // get the archive folder
  const archiveFolder = await getArchiveFolder();

  // get a list of all the folders
  const totalSizeInMB = Math.ceil(getFolderSize(archiveFolder) / 1024 / 1024);

  // validate
  if (totalSizeInMB > maxSize) {
    return {
      originalArchiveFolderSize: totalSizeInMB,
      deletedFolders: deleteSubfoldersToReduceSize(archiveFolder, makeSize),
    };
  }

  // at the end of the day...
  return {
    originalArchiveFolderSize: totalSizeInMB,
    deletedFolders: 0,
  };
};
