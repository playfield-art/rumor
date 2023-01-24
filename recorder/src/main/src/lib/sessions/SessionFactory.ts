import { AudioList, RecordingMeta, Session } from "@shared/interfaces";
import fsExtra from "fs-extra";
import path from "path";
import { UNWANTED_FILES } from "../../consts";

export class SessionFactory {
  private sessionsFolder;

  constructor(sessionsFolder: string) {
    this.sessionsFolder = sessionsFolder;
  }

  async getSessions(): Promise<Session[]> {
    // validate
    if (this.sessionsFolder === "") return [];

    // get all the sessions in the session folder
    const sessionFolders = (await fsExtra.readdir(this.sessionsFolder)).filter(
      (sessionFolder) => !UNWANTED_FILES.includes(sessionFolder)
    );

    // check if we have sessions
    if (!sessionFolders || sessionFolders.length === 0) return [];

    // get files in each session folder
    return sessionFolders.map((sessionFolder) => {
      // create new session
      const session: Session = {
        meta: {
          language: "",
          boothSlug: "",
          sessionId: "",
          recordingDate: "",
          recordingTime: "",
        },
        recordings: [],
        audioList: {
          chapters: [],
          VO: [],
          SC: [],
        },
      };

      // get the folder path of the session
      const sessionFolderPath = path.join(this.sessionsFolder, sessionFolder);

      // get the files in the session folder
      const sessionFiles = fsExtra
        .readdirSync(sessionFolderPath)
        .filter((sessionFile) => !UNWANTED_FILES.includes(sessionFile));

      // validate
      if (sessionFiles && sessionFiles.length > 0) {
        // get meta file
        if (sessionFiles.find((file) => file === "meta.json")) {
          session.meta = JSON.parse(
            fsExtra.readFileSync(
              path.join(sessionFolderPath, "meta.json"),
              "utf8"
            )
          ) as RecordingMeta;
        }

        // get audio list file
        if (sessionFiles.find((file) => file === "audiolist.json")) {
          session.audioList = JSON.parse(
            fsExtra.readFileSync(
              path.join(sessionFolderPath, "audiolist.json"),
              "utf8"
            )
          ) as AudioList;
        }

        // get the recordings
        session.recordings = sessionFiles
          .filter((fileName) => fileName.endsWith(".wav"))
          .map((fileName) => ({
            fileName,
            fullPath: path.join(sessionFolderPath, fileName),
            language: fileName
              .substring(0, fileName.lastIndexOf("."))
              .split("-")[0],
            order: parseInt(
              fileName.substring(0, fileName.lastIndexOf(".")).split("-")[1]
            ),
            questionId: fileName
              .substring(0, fileName.lastIndexOf("."))
              .split("-")[2],
          }))
          .sort((a, b) => a.order - b.order);
      }

      // add to output
      return session;
    });
  }
}
