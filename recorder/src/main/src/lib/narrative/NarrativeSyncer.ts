/**
 * A Library to sync the narrative in the recorder
 */

import { Chapter, ChapterMeta, Narrative } from "@shared/interfaces";
import fsExtra from "fs-extra";
import Downloader from "nodejs-file-downloader";
import { join } from "path";
import { createEmptyFolders } from "../filesystem";

interface NarrativeChapter {
  chapters: Chapter[] | null;
  name: string;
}

export class NarrativeSyncer {
  private folderPath: string = "";

  private narrative: Narrative;

  constructor(folderPath: string, narrative: Narrative) {
    this.folderPath = folderPath;
    this.narrative = narrative;
  }

  async cleanNarrativesFolder() {
    await fsExtra.emptyDir(this.folderPath);
  }

  async createEmptyFoldersForNarrative() {
    // validate
    if (!this.narrative || this.folderPath === "") return;

    // get an array of the narrativekeys, so we can loop easier
    const narrativeKeys = Object.keys(this.narrative);

    // create folders
    await createEmptyFolders(this.folderPath, narrativeKeys);
  }

  async start() {
    // validate
    if (!this.narrative || this.folderPath === "") return;

    // clean the narratives folder
    await this.cleanNarrativesFolder();

    // create the empty narrative folder
    await this.createEmptyFoldersForNarrative();

    // get an array of the narrativekeys, so we can loop easier
    const narrativeKeys = Object.keys(this.narrative);

    // get the narrative chapters
    const narrativeChapters: NarrativeChapter[] = narrativeKeys.map(
      (narrativeKey) => ({
        chapters: this.narrative[narrativeKey as keyof Narrative],
        name: narrativeKey,
      })
    );

    // create the work arrays
    let createOptionFoldersPromises: Promise<void>[] = [];
    let downloadOptionsPromises: Promise<void>[] = [];

    // loop over every narrative chapter
    narrativeChapters.forEach((narrativeChapter) => {
      // validate
      if (!narrativeChapter || !narrativeChapter.chapters) return;

      // ----
      // Create Promises for creating an option folder for every chapter type
      // ----

      createOptionFoldersPromises = [
        ...createOptionFoldersPromises,
        ...narrativeChapter.chapters.map(async (chapter) => {
          // define the option folder
          const chapterOptionFolder = join(
            this.folderPath,
            narrativeChapter.name,
            chapter.id
          );

          // create the folder in the file system
          await fsExtra.mkdir(chapterOptionFolder);

          // create a meta file for this chapter
          const chapterMeta: ChapterMeta = {
            id: chapter.id,
            title: chapter.title,
            narrativePart: chapter.narrativePart,
          };
          await fsExtra.writeFile(
            join(chapterOptionFolder, "meta.json"),
            JSON.stringify(chapterMeta)
          );

          // if we have a soundscape, create the promise for this scape
          if (chapter.soundScape) {
            // console.log("downloading", chapter.soundScape.audioUrl);
            await new Downloader({
              url: `${chapter.soundScape.audioUrl}`,
              directory: `${chapterOptionFolder}`,
              fileName: `soundscape${chapter.soundScape.ext}`,
            }).download();
          }
        }),
      ];
    });

    console.log("Creating option folders, adding soundscape...");
    await Promise.all(createOptionFoldersPromises);

    // loop over every narrative chapter
    narrativeChapters.forEach((narrativeChapter) => {
      // ----
      // Create Promises for downloading the sound files
      // ----
      let blockOrder = 1;

      narrativeChapter.chapters?.forEach((chapter) => {
        // validate
        if (!chapter || !chapter.blocks) return;

        // if we have blocks, create the promises for the audio
        blockOrder = 0;

        // map every block, because we got work to do
        chapter.blocks.forEach(async (block) => {
          // define the option folder
          const chapterOptionFolder = join(
            this.folderPath,
            narrativeChapter.name,
            chapter.id
          );

          // create download promises
          downloadOptionsPromises = [
            ...downloadOptionsPromises,
            ...block.audio.map(async (audio) => {
              if (!audio.audioUrl) return Promise.resolve();
              await new Downloader({
                url: `${audio.audioUrl}`,
                directory: `${chapterOptionFolder}`,
                fileName: `${audio.language}-${(blockOrder += 1)}-${
                  block.type
                }-${block.cms_id}${audio.ext}`,
              }).download();
              return Promise.resolve();
            }),
          ];
        });
      });
    });

    // start executing the logic
    console.log("Downloading all the narrative audio...");
    await Promise.all(downloadOptionsPromises);

    // we are done with the work..
    console.log("Narratives synced succesfully!");
  }
}
