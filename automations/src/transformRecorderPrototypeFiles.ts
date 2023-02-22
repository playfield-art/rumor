/**
 * This script will change the filenames of the older
 * Rumor prototype recorder to the correct ones
 */

import fs from 'fs';
import path from 'path';
import { convertSessionIdToDateAndTime } from '../lib/utils';

interface TransformFile {
  originalFilename: string,
  targetFilename: string
}

// get the recordings path from the parameters
const recordingsPath = process.argv.slice(2)[0];

// an array of the files to transform

// ---
// VERSION 1
// ---

// const transformFiles: TransformFile[] = [
//   { originalFilename: "ANSW-VO_1.wav", targetFilename: "nl-1-1.wav" },
//   { originalFilename: "ANSW-VO_2.wav", targetFilename: "nl-2-2.wav" },
//   { originalFilename: "ANSW-VO_3.wav", targetFilename: "nl-3-3.wav" },
//   { originalFilename: "ANSW-VO_4.wav", targetFilename: "nl-4-4.wav" },
//   { originalFilename: "ANSW-VO_5.wav", targetFilename: "nl-5-5.wav" },
//   { originalFilename: "ANSW-VO_6.wav", targetFilename: "nl-6-6.wav" },
//   { originalFilename: "ANSW-VO_7.wav", targetFilename: "nl-7-7.wav" },
//   { originalFilename: "ANSW-VO_8.wav", targetFilename: "nl-8-8.wav" },
//   { originalFilename: "ANSW-VO_9.wav", targetFilename: "nl-9-9.wav" },
//   { originalFilename: "ANSW-VO_10.wav", targetFilename: "nl-10-10.wav" },
//   { originalFilename: "ANSW-VO_11.wav", targetFilename: "nl-11-11.wav" },
//   { originalFilename: "ANSW-VO_12.wav", targetFilename: "nl-12-12.wav" },
//   { originalFilename: "ANSW-VO_13.wav", targetFilename: "nl-13-13.wav" },
//   { originalFilename: "ANSW-VO_14.wav", targetFilename: "nl-14-14.wav" },
//   { originalFilename: "ANSW-VO_15.wav", targetFilename: "nl-15-15.wav" },
//   { originalFilename: "ANSW-VO_16.wav", targetFilename: "nl-16-16.wav" },
// ]

// ---
// VERSION 2
// ---

const transformFiles: TransformFile[] = [
  { originalFilename: "ANSW-VO_1.wav", targetFilename: "nl-1-17.wav" },
  { originalFilename: "ANSW-VO_2.wav", targetFilename: "nl-2-18.wav" },
  { originalFilename: "ANSW-VO_3.wav", targetFilename: "nl-3-19.wav" },
  { originalFilename: "ANSW-VO_4.wav", targetFilename: "nl-4-20.wav" },
  { originalFilename: "ANSW-VO_5.wav", targetFilename: "nl-5-21.wav" },
  { originalFilename: "ANSW-VO_6.wav", targetFilename: "nl-6-22.wav" },
  { originalFilename: "ANSW-VO_7.wav", targetFilename: "nl-7-23.wav" },
  { originalFilename: "ANSW-VO_8.wav", targetFilename: "nl-8-24.wav" },
  { originalFilename: "ANSW-VO_9.wav", targetFilename: "nl-9-25.wav" },
  { originalFilename: "ANSW-VO_10.wav", targetFilename: "nl-10-26.wav" },
  { originalFilename: "ANSW-VO_11.wav", targetFilename: "nl-11-27.wav" },
  { originalFilename: "ANSW-VO_12.wav", targetFilename: "nl-12-28.wav" },
  { originalFilename: "ANSW-VO_13.wav", targetFilename: "nl-13-29.wav" },
  { originalFilename: "ANSW-VO_14.wav", targetFilename: "nl-14-30.wav" },
  { originalFilename: "ANSW-VO_15.wav", targetFilename: "nl-15-31.wav" },
  { originalFilename: "ANSW-VO_16.wav", targetFilename: "nl-16-32.wav" },
  { originalFilename: "ANSW-VO_17.wav", targetFilename: "nl-17-33.wav" },
  { originalFilename: "ANSW-VO_18.wav", targetFilename: "nl-18-34.wav" },
  { originalFilename: "ANSW-VO_19.wav", targetFilename: "nl-19-35.wav" },
]

// check if the path exists
if(!fs.existsSync(recordingsPath)) {
  console.error('The recordingspath does not exist.');
  process.exit();
}

// get all the folders
const folders = fs.readdirSync(recordingsPath);

// remove unwanted files
const filteredFolders = folders.filter((folder) => folder !== '.DS_Store');

// loop over every folder
filteredFolders.forEach((folder) => {
  // the path
  const folderPath = path.join(recordingsPath, folder);

  // get the files in the folder
  const files = fs.readdirSync(folderPath);

  // validate
  if(files.length <= 0) return;

  // filter the files
  const filteredFiles = files.filter((folder) => folder !== '.DS_Store');

  // create the full path
  const folderFullPath = path.join(recordingsPath, folder);

  // loop over files and replace the name
  filteredFiles.forEach((file) => {
    // find the replacer
    const transformFile = transformFiles.find((transformFile) => {
      return transformFile.originalFilename === file
    });

    // validate
    if(transformFile && transformFile.targetFilename) {
      fs.renameSync(
        path.join(folderFullPath, file),
        path.join(folderFullPath, transformFile?.targetFilename)
      );
    }
  });

  // create a file (empty) with the audiolist
  fs.writeFileSync(path.join(folderFullPath, 'audiolist.json'), JSON.stringify({}));

  // get the date and time
  const convertedSessionIdInDateAndTime = convertSessionIdToDateAndTime(folder);

  // create the meta file
  fs.writeFileSync(path.join(folderFullPath, 'meta.json'), JSON.stringify({
    language: 'nl',
    boothSlug: 'ru1',
    sessionId: folder,
    recordingDate: convertedSessionIdInDateAndTime.date,
    recordingTime: convertedSessionIdInDateAndTime.time
  }));
});

// let them know
console.log('The files were successfully transformed.');