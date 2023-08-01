import fs from "fs";
import { LocalNarrative } from "@shared/interfaces";
import { getNarrativesFolder } from "../filesystem";
import { UNWANTED_FILES } from "../../consts";

/**
 * Get the local narrative
 * @param narrative The narrative to get
 */
export const getLocalNarrative = async (): Promise<LocalNarrative> => {
  // set the default output
  const output: LocalNarrative = {
    introChapters: [],
    firstChapters: [],
    secondChapters: [],
    thirdChapters: [],
    outroChapters: [],
  };

  // get the narratives folder
  const narrativesFolder = await getNarrativesFolder();

  // validate
  if (!narrativesFolder) return output;

  // get list of folders
  const folders = fs
    .readdirSync(narrativesFolder)
    .filter((file) => !UNWANTED_FILES.includes(file));

  // loop through the folders and validate
  let valid = true;
  Object.keys(output).forEach((outputProp) => {
    if (!folders.includes(outputProp)) {
      valid = false;
    }
  });

  // validate
  if (!valid) return output;

  // loop over every folder
  folders.forEach((folder) => {
    // find the chapeter ids in the folder
    const chapterOptionIds = fs
      .readdirSync(`${narrativesFolder}/${folder}`)
      .filter((file) => !UNWANTED_FILES.includes(file));
    // validate
    if (!chapterOptionIds) return;

    // loop over evry chapter id
    chapterOptionIds.forEach((chapterOptionId) => {
      // define the path of the meta file
      const metaPath = `${narrativesFolder}/${folder}/${chapterOptionId}/meta.json`;

      // validate
      if (!fs.existsSync(metaPath)) return;

      // read the meta file
      const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));

      // add the chapter to the output
      output[folder as keyof typeof output].push({
        id: chapterOptionId,
        title: meta?.title ?? "No title",
        narrativePart: meta?.narrativePart ?? "No narrative part",
      });
    });
  });

  // return the output
  return output;
};
