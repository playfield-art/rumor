/**
 * A Library to sync the narrative in the recorder
 */

import { join } from "path";
import {
  Chapter,
  ChapterMeta,
  Narrative,
  StatusCallback,
} from "@shared/interfaces";
import fsExtra from "fs-extra";
import Downloader from "nodejs-file-downloader";
import { createEmptyFolders } from "../filesystem";

interface NarrativeChapter {
  chapters: Chapter[] | null;
  name: string;
}

export class NarrativeSyncer {
  private folderPath: string = "";

  private narrative: Narrative;

  private statusCallback: StatusCallback | null;

  constructor(
    folderPath: string,
    narrative: Narrative,
    statusCallback: StatusCallback | null
  ) {
    this.folderPath = folderPath;
    this.narrative = narrative;
    this.statusCallback = statusCallback;
  }

  async cleanNarrativesFolder() {
    await fsExtra.emptyDir(this.folderPath);
  }

  async resolvePromisesSeq(tasks: Promise<any>[]) {
    const results = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const task of tasks) {
      // eslint-disable-next-line no-await-in-loop
      results.push(await task);
    }

    return results;
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
    let downloadOptionsPromises: (() => Promise<void>)[] = [];

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
        }),
      ];
    });

    // let them know
    if (this.statusCallback)
      this.statusCallback("Creating option folders, adding soundscapes...");

    await Promise.all(createOptionFoldersPromises);

    // loop over every narrative chapter
    narrativeChapters.forEach((narrativeChapter) => {
      // ----
      // Create Promises for downloading the sound files
      // ----
      narrativeChapter.chapters?.forEach((chapter) => {
        // validate
        if (!chapter || !chapter.blocks) return;

        // map every block, because we got work to do
        chapter.blocks.forEach(async (block) => {
          // define the option folder
          const chapterOptionFolder = join(
            this.folderPath,
            narrativeChapter.name,
            chapter.id
          );

          /**
           * Soundscape
           */

          if (block.soundscape) {
            downloadOptionsPromises = [
              ...downloadOptionsPromises,
              () =>
                new Promise((resolve) => {
                  // create the filename
                  const soundscapeFileName = `sc-${block.order}-${block.cms_id}${block.soundscape?.ext}`;

                  // let them know
                  if (this.statusCallback)
                    this.statusCallback(`Downloading ${soundscapeFileName}...`);

                  // start downloading the audio
                  new Downloader({
                    url: `${block.soundscape?.audioUrl}`,
                    directory: `${chapterOptionFolder}`,
                    fileName: soundscapeFileName,
                  })
                    .download()
                    .then(() => {
                      resolve();
                    });
                }),
            ];
          }

          /**
           * Voice over and questions audio
           */

          downloadOptionsPromises = [
            ...downloadOptionsPromises,
            ...block.audio.map(
              (audio): (() => Promise<void>) =>
                () =>
                  new Promise((resolve) => {
                    // if no audio, resolve immediatly
                    if (!audio.audioUrl) resolve();

                    // create the filename
                    const audioFileName = `${audio.language}-${block.order}-${block.type}-${block.cms_id}${audio.ext}`;

                    // let them know
                    if (this.statusCallback)
                      this.statusCallback(`Downloading ${audioFileName}...`);

                    // start downloading the audio
                    new Downloader({
                      url: `${audio.audioUrl}`,
                      directory: `${chapterOptionFolder}`,
                      fileName: audioFileName,
                    })
                      .download()
                      .then(() => {
                        resolve();
                      });
                  })
            ),
          ];
        });
      });
    });

    // start executing the logic
    // await this.resolvePromisesSeq(downloadOptionsPromises);
    // eslint-disable-next-line no-restricted-syntax
    for (const downloadOption of downloadOptionsPromises) {
      // eslint-disable-next-line no-await-in-loop
      await downloadOption();
    }

    // let them know
    if (this.statusCallback)
      this.statusCallback("Narratives synced succesfully!");
  }
}
