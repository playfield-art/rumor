import path from "path";
import { AudioList, RecordingMeta, Session } from "@shared/interfaces";
import fsExtra from "fs-extra";
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
    return sessionFolders
      .map((sessionFolder) => {
        // create new session
        const session: Session = {
          folder: path.join(this.sessionsFolder, sessionFolder),
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

        // get the files in the session folder
        const sessionFiles = fsExtra
          .readdirSync(session.folder)
          .filter((sessionFile) => !UNWANTED_FILES.includes(sessionFile));

        // validate
        if (sessionFiles && sessionFiles.length > 0) {
          // get meta file
          if (sessionFiles.find((file) => file === "meta.json")) {
            session.meta = JSON.parse(
              fsExtra.readFileSync(
                path.join(session.folder, "meta.json"),
                "utf8"
              )
            ) as RecordingMeta;
          }

          // get audio list file
          if (sessionFiles.find((file) => file === "audiolist.json")) {
            session.audioList = JSON.parse(
              fsExtra.readFileSync(
                path.join(session.folder, "audiolist.json"),
                "utf8"
              )
            ) as AudioList;
          }

          // get the recordings
          session.recordings = sessionFiles
            .filter((fileName) => fileName.endsWith(".wav"))
            .map((fileName) => ({
              fileName: path.basename(fileName, path.extname(fileName)),
              ext: path.extname(fileName),
              fullPath: path.join(session.folder, fileName),
              directory: session.folder,
              language: fileName
                .substring(0, fileName.lastIndexOf("."))
                .split("-")[0],
              order: parseInt(
                fileName.substring(0, fileName.lastIndexOf(".")).split("-")[1]
              ),
              questionId: fileName
                .substring(0, fileName.lastIndexOf("."))
                .split("-")[2],
              isEmpty:
                fsExtra.statSync(path.join(session.folder, fileName)).size ===
                0,
            }))
            .sort((a, b) => a.order - b.order);
        }

        // add to output
        return session;
      })
      .sort((a, b) => {
        // sort by date
        const dateA = new Date(
          `${a.meta.recordingDate} ${a.meta.recordingTime}`
        );
        const dateB = new Date(
          `${b.meta.recordingDate} ${b.meta.recordingTime}`
        );

        // sort
        return dateA.getTime() - dateB.getTime();
      });
  }
}
