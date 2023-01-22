import { RecordingMeta, Session } from '@shared/interfaces';
import fsExtra from 'fs-extra';
import path from 'path';
import { UNWANTED_FILES } from '../../consts';

export class SessionFactory {
  private sessionsFolder;

  constructor(sessionsFolder: string) {
    this.sessionsFolder = sessionsFolder;
  }

  async getSessions(): Promise<Session[]> {
    // validate
    if(this.sessionsFolder === "") return [];

    // get all the sessions in the session folder
    const sessions = (await fsExtra.readdir(this.sessionsFolder))
                                   .filter(sessionFolder => !UNWANTED_FILES.includes(sessionFolder));

    // check if we have sessions
    if(!sessions || sessions.length === 0) return [];

    // define the output
    const output: Session[] = [];

    // get files in each session folder
    for(const sessionFolder of sessions) {
      // create new session
      const session: Session = {
        meta: {
          boothId: "",
          sessionId: "",
          recordingDate: "",
          recordingTime: ""
        },
        recordings: []
      }

      // get the folder path of the session
      const sessionFolderPath = path.join(this.sessionsFolder, sessionFolder);

      // get the files in the session folder
      const sessionFiles = (await fsExtra.readdir(sessionFolderPath))
                                         .filter(sessionFile => !UNWANTED_FILES.includes(sessionFile));

      // validate
      if(sessionFiles && sessionFiles.length > 0) {
        // get meta file
        if(sessionFiles.find(file => file === "meta.json")) {
          session.meta = JSON.parse(fsExtra.readFileSync(path.join(sessionFolderPath, 'meta.json'), "utf8")) as RecordingMeta;
        }

        // get the recordings
        session.recordings = sessionFiles.filter(fileName => fileName.endsWith('.wav'))
                                         .map(fileName => ({
                                              fileName,
                                              fullPath: path.join(sessionFolderPath, fileName),
                                              language: fileName.substring(0, fileName.lastIndexOf('.')).split('-')[0],
                                              order: parseInt(fileName.substring(0, fileName.lastIndexOf('.')).split('-')[1]),
                                              questionId: fileName.substring(0, fileName.lastIndexOf('.')).split('-')[2],
                                            })
                                          )
                                         .sort((a, b) => a.order - b.order)
      }

      // add to output
      output.push(session);
    }

    // return the output
    return output;
  }
}