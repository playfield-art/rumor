/**
 * A Library to sync the narrative in the recorder
 */

import { Narrative } from "@shared/interfaces";
import fsExtra from 'fs-extra';
import Downloader from "nodejs-file-downloader";
import { join } from 'path';

export class NarrativeSyncer {
  private folderPath: string = "";
  private narrative: Narrative | null = null;

  constructor(folderPath: string, narrative: Narrative) {
    this.folderPath = folderPath;
    this.narrative = narrative;
  }

  async cleanNarrativesFolder() {
    await fsExtra.emptyDir(this.folderPath);
  }

  async createEmptyFolders() {
    // validate
    if(!this.narrative || this.folderPath === "") return;

    // get an array of the narrativekeys, so we can loop easier
    const narrativeKeys = Object.keys(this.narrative);

    // loop over every key
    for(const narrativeKey of narrativeKeys) {
      await fsExtra.mkdir(join(this.folderPath, narrativeKey));
    }
  }

  async start() {
    // validate
    if(!this.narrative || this.folderPath === "") return;

    // clean the narratives folder
    await this.cleanNarrativesFolder();

    // create the empty narrative folder
    await this.createEmptyFolders();

    // get an array of the narrativekeys, so we can loop easier
    const narrativeKeys = Object.keys(this.narrative);

    // loop over the chapters and download the files
    for(const narrativeKey of narrativeKeys) {
      // remember the chapter
      let chapterNumber = 1;

      // get the possible chapters
      const currentChapterOptions = this.narrative[narrativeKey as keyof Narrative];

      // if we have possible chapters, create the folders and download the files
      if(currentChapterOptions.length > 0) {
        // for every chapter option
        for(const chapterOption of currentChapterOptions) {
          // create the folder path of each option
          const chapterOptionFolder = join(this.folderPath, narrativeKey, (chapterNumber++).toString());

          // create the folder in the file system
          await fsExtra.mkdir(chapterOptionFolder);

          //if we have a soundscape, create the promise for this scape
          if(chapterOption.soundScape) {
            console.log('downloading', chapterOption.soundScape.audioUrl);
            await new Downloader({
              url: `${chapterOption.soundScape.audioUrl}`,
              directory: `${chapterOptionFolder}`,
              fileName: `soundscape${chapterOption.soundScape.ext}`
            }).download()
          }

          // if we have blocks, create the promises for the audio
          if(chapterOption.blocks && chapterOption.blocks.length > 0) {
            let blockOrder = 1;
            for(const block of chapterOption.blocks) {
              for(const audio of block.audio) {
                console.log('downloading', audio.audioUrl);
                await new Downloader({
                  url: `${audio.audioUrl}`,
                  directory: `${chapterOptionFolder}`,
                  fileName: `${audio.language}-${blockOrder++}-${block.type}-${block.cms_id}${audio.ext}`
                }).download()
              }
            }
          }
        };
      }
    }
  }
}