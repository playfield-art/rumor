import path from "path";
import fs from "fs";
import "dotenv/config";
// import {
//   CreateUploadFolderInParentDocument,
//   CreateUploadFolderInRootDocument,
//   FindUploadFolderDocument,
//   GetChaptersDocument,
//   GetLastPathIdDocument,
//   FindUploadFolderInParentDocument,
//   UpdateFileNameDocument,
//   CreateSessionDocument,
//   GetBoothIdDocument,
//   Enum_Session_Language,
//   UpdateFileFolderPathDocument,
// } from "cms-types/gql/graphql";
import { GraphQLClient } from "graphql-request";

/**
 * Get the API endpoint
 * @returns
 */
const getApiEndpoint = async (): Promise<string> => {
  if (process.env.RUMOR_CMS_API_URL) return process.env.RUMOR_CMS_API_URL;
  else throw new Error("No Rumor CMS API URL was found");
};

/**
 * Get the API token
 * @returns
 */
const getApiToken = async (): Promise<string> => {
  if (process.env.RUMOR_CMS_API_KEY) return process.env.RUMOR_CMS_API_KEY;
  else throw new Error("No Rumor CMS token was found");
};

/**
 * Returns a GraphQL client to work with
 * @returns
 */
const getGraphQLClient = async (): Promise<GraphQLClient> =>
  new GraphQLClient(`${await getApiEndpoint()}/graphql`, {
    headers: {
      contentType: "application/json",
      authorization: `Bearer ${await getApiToken()}`,
    },
  });

/**
 * Gets the booth id, coming from the booth slug
 * @param boothSlug
 */
export const getBoothId = async (boothSlug: string): Promise<string> => {
  // get the graphql client
  const gqlClient = await getGraphQLClient();

  // do the request
  const { booths } = await gqlClient.request(GetBoothIdDocument, {
    slug: boothSlug,
  });

  // validate and return the id
  if (booths?.data && booths.data.length === 1) {
    return booths.data[0].id || "";
  }

  // if we made it here, the booth id does not exist
  throw new Exception({
    message: `The booth with slug ${boothSlug} does not exists.`,
    where: "getBoothId",
  });
};

/**
 * Get the last path id of an uploadfolder
 * @returns
 */
export const getLastPathId = async () => {
  // get the graphql client
  const gqlClient = await getGraphQLClient();

  const { uploadFolders } = await gqlClient.request(GetLastPathIdDocument);
  let lastPathId = 0;
  if (uploadFolders?.data && uploadFolders.data.length > 0) {
    lastPathId = uploadFolders.data.pop()?.attributes?.pathId || 0;
  }
  return lastPathId;
};

/**
 * Gets the narrative from the CMS
 * @returns
 */
export const getNarrative = async (boothSlug: string) => {
  // get the graphql client
  const gqlClient = await getGraphQLClient();

  // define the output
  const output: Narrative = {
    introChapters: [],
    firstChapters: [],
    secondChapters: [],
    thirdChapters: [],
    outroChapters: [],
  };

  /**
   * ----
   * Get all the data from the rumor-cms
   * ----
   */

  const narrativeChapterData: NarrativeChapterData = {
    introChapters: {},
    firstChapters: {},
    secondChapters: {},
    thirdChapters: {},
    outroChapters: {},
  };

  const narrativeChapterDataPromises = narrativeChapters.map(
    async (narrativePart) => {
      narrativeChapterData[
        `${narrativePart}Chapters` as keyof NarrativeChapterData
      ] = await gqlClient.request(GetChaptersDocument, {
        narrativePart: narrativePart,
        slug: boothSlug,
      });
    }
  );

  await Promise.all(narrativeChapterDataPromises);

  /**
   * ----
   * Transform the data coming from CMS
   * ----
   */

  // loop over each narrative part and get the chapter
  Object.keys(narrativeChapterData).forEach((narrativeChapterDataKey) => {
    // get the narrative chapter data
    const narrativeChapterDataItem =
      narrativeChapterData[
        narrativeChapterDataKey as keyof NarrativeChapterData
      ];

    // only if there are chapters available
    if (
      narrativeChapterDataItem.chapters?.data.length &&
      narrativeChapterDataItem.chapters?.data.length > 0
    ) {
      output[narrativeChapterDataKey as keyof Narrative] =
        narrativeChapterDataItem.chapters.data.map(({ id, attributes }) => {
          // transform all the blocks in this chapter
          const chapterBlocks: ChapterBlock[] | undefined =
            attributes?.blocks?.map((b, i) => {
              // define the chapter block output
              const chapterBlock: ChapterBlock = {
                type:
                  b?.__typename === "ComponentBlocksChapterQuestionBlock"
                    ? ChapterBlockType.Question
                    : ChapterBlockType.VoiceOver,
                order: i + 1,
                title: "",
                cms_id: "",
                description: "",
                soundscape: null,
                audio: [],
              };

              // chapterblocks behave different based on type
              if (b?.__typename === "ComponentBlocksChapterQuestionBlock") {
                chapterBlock.title = b.question?.data?.attributes?.title || "";
                chapterBlock.description =
                  b.question?.data?.attributes?.description || "";
                chapterBlock.cms_id = b.question?.data?.id || "9999";
                chapterBlock.soundscape = b.soundscape?.data?.attributes?.url
                  ? {
                      audioUrl: b?.soundscape?.data?.attributes?.url || "",
                      ext: b?.soundscape?.data?.attributes?.ext || "",
                    }
                  : null;
                chapterBlock.audio =
                  b.question?.data?.attributes?.audio?.map((a) => ({
                    audioUrl: a?.audio.data?.attributes?.url || "",
                    language: a?.language?.data?.attributes?.short || "unknown",
                    ext: a?.audio.data?.attributes?.ext || "",
                  })) || [];
              } else if (
                b?.__typename === "ComponentBlocksChapterVoiceOverBlock"
              ) {
                chapterBlock.title =
                  b.voice_over?.data?.attributes?.title || "";
                chapterBlock.description =
                  b.voice_over?.data?.attributes?.description || "";
                chapterBlock.cms_id = b.voice_over?.data?.id || "9999";
                chapterBlock.soundscape = b.soundscape?.data?.attributes?.url
                  ? {
                      audioUrl: b?.soundscape?.data?.attributes?.url || "",
                      ext: b?.soundscape?.data?.attributes?.ext || "",
                    }
                  : null;
                chapterBlock.audio =
                  b.voice_over?.data?.attributes?.audio?.map((a) => ({
                    audioUrl: a?.audio.data?.attributes?.url || "",
                    language: a?.language?.data?.attributes?.short || "unknown",
                    ext: a?.audio.data?.attributes?.ext || "",
                  })) || [];
              }

              // returns the chapter block
              return chapterBlock;
            });

          return {
            id,
            title: attributes?.title,
            soundScape: attributes?.soundscape?.data
              ? {
                  audioUrl: attributes?.soundscape?.data?.attributes?.url,
                  ext: attributes?.soundscape?.data?.attributes?.ext,
                }
              : null,
            narrativePart: attributes?.narrative_part,
            blocks: chapterBlocks,
          } as Chapter;
        });
    }
  });

  // return the narrative
  return output;
};

/**
 * Get the upload folder id for a booth
 */
export const getUploadFolderIdForBooth = async (
  boothSlug: string
): Promise<string> => {
  // get the graphql client
  const gqlClient = await getGraphQLClient();

  // find the upload folder in the root of our media library
  const { uploadFolders } = await gqlClient.request(FindUploadFolderDocument, {
    folderName: boothSlug,
  });

  // if we found data, return that folder
  if (uploadFolders?.data && uploadFolders.data.length > 0) {
    return uploadFolders.data[0].id || "";
  }

  // we didn't find data, so let's create the folder
  const lastPathId = await getLastPathId();
  const newPathId = lastPathId + 1;
  await gqlClient.request(CreateUploadFolderInRootDocument, {
    name: boothSlug,
    path: `/${boothSlug}`,
    pathId: newPathId,
  });

  // recursivly, let's try to find the folder again
  return getUploadFolderIdForBooth(boothSlug);
};

/**
 * Check if a session id for a booth exists
 * @param boothSlug The booth slug
 * @param sessionId The session id
 * @returns
 */
export const uploadFolderForSessionExists = async (
  boothSlug: string,
  sessionId: string
) => {
  // get the graphql client
  const gqlClient = await getGraphQLClient();

  // get the upload folder for a booth
  const uploadFolderIdForBooth = await getUploadFolderIdForBooth(boothSlug);

  // find the upload folder for this session in the booth folder
  const uploadFolderForSession = await gqlClient.request(
    FindUploadFolderInParentDocument,
    {
      parent: uploadFolderIdForBooth,
      sessionId: sessionId,
    }
  );

  // didn't find it? Or did we?
  return (
    (
      uploadFolderForSession.uploadFolder?.data?.attributes?.children?.data ||
      []
    ).length > 0
  );
};

/**
 * Create an upload folder for a session
 */
export const createUploadFolderForSession = async (
  boothSlug: string,
  sessionId: string,
  files: string[]
) => {
  // get the graphql client
  const gqlClient = await getGraphQLClient();

  // get the folder id for a booth
  const uploadFolderIdForBooth = await getUploadFolderIdForBooth(boothSlug);

  // get the last id path and create a new path id
  const lastPathId = await getLastPathId();
  const newPathId = lastPathId + 1;

  // promises
  const promises = [];

  // create a new upload folder in a session
  promises.push(
    gqlClient.request(CreateUploadFolderInParentDocument, {
      pathId: newPathId,
      path: `/${sessionId}`,
      name: sessionId,
      files,
      parent: uploadFolderIdForBooth,
    })
  );

  // move all the files to the new folder in database
  promises.push(
    gqlClient.request(UpdateFileFolderPathDocument, {
      ids: files,
      folderPath: `/${sessionId}`,
    })
  );

  // return the big promise
  return Promise.all(promises);
};

/**
 * Archive a session by moving it to the archive folder
 * @param sessionId
 */
const archiveSession = async (sessionId: string) => {
  // move folder to the archive directory
  // first check if folder already exists, otherwise add a random id
  const sessionRecordingFolder = `${await getRecordingsFolder()}/${sessionId}`;
  const archivedSessionRecordingFolder = `${await getArchiveFolder()}/${sessionId}`;
  const archivedSessionFolderExists = fsExtra.existsSync(
    archivedSessionRecordingFolder
  );

  await moveFolder(
    sessionRecordingFolder,
    archivedSessionFolderExists
      ? `${archivedSessionRecordingFolder}-${Utils.makeRandomId(5)}`
      : archivedSessionRecordingFolder
  );
};

/**
 * Uploads a file to the CMS
 * @param filePath
 * @returns
 */
export const uploadFileToCms = async (filePath: string) => {
  const form = new FormData();
  form.append("files", fsExtra.createReadStream(filePath));
  const res = await nodeFetch(`${await getApiEndpoint()}/api/upload`, {
    method: "POST",
    body: form,
    headers: {
      Authorization: `Bearer ${await getApiToken()}`,
    },
  });
  const json = await res.json();
  if (json && json.length > 0) return json.pop();
  return null;
};

/**
 * Upload Sessions
 * @param sessions
 */
export const uploadSessions = async (
  sessions: Session[],
  statusCallback: StatusCallback | null = null
) => {
  // get the graphql client
  const gqlClient = await getGraphQLClient();

  // loop over the different sessions and create worker promises
  // const uploadPromises = sessions.map(async (session) => {
  // eslint-disable-next-line no-restricted-syntax
  for await (const session of sessions) {
    // let them now
    if (statusCallback)
      await statusCallback(`Uploading session ${session.meta.sessionId}...`);

    // check if the upload folder for the session exists
    const doesFolderForSessionExist = await uploadFolderForSessionExists(
      session.meta.boothSlug,
      session.meta.sessionId
    );

    // validate
    if (doesFolderForSessionExist) {
      // let them now
      if (statusCallback)
        await statusCallback(
          `Upload folder for session "${session.meta.sessionId}" on booth "${session.meta.boothSlug}" already exists`
        );

      // archive the folder
      await archiveSession(session.meta.sessionId);
    } else {
      /**
       * I. Get the readstreams for every file we need to upload
       * and upload them to the CMS
       */

      // only keep the recordings that are not empty
      const notEmptyRecordings = session.recordings.filter((r) => !r.isEmpty);

      // create file uploads
      const fileUploads = notEmptyRecordings.map((r) => {
        // get the path
        let { fullPath } = r;

        // check if we have an mp3 version of the file
        const mp3FilePath = `${r.directory}/${r.fileName}.mp3`;
        if (fsExtra.existsSync(mp3FilePath)) fullPath = mp3FilePath;

        // if not, take the original wav
        return uploadFileToCms(fullPath);
      });

      // change the filenames, then we can filter better in our CMS
      if (statusCallback)
        await statusCallback(
          `Uploading files for session "${session.meta.sessionId}" on booth "${session.meta.boothSlug}"`
        );

      // filter out the undefineds (if there are any)
      const fileUploadResponses = (await Promise.all(fileUploads)).filter(
        (f) => f !== (undefined && null && "" && {} && [])
      );

      /**
       * II. Rename the uploaded file to the correct name in the CMS
       */

      fileUploadResponses.map(async (response) => {
        if (response && response?.id && response?.name) {
          await gqlClient.request(UpdateFileNameDocument, {
            id: response.id,
            fileName: `${session.meta.boothSlug}-${session.meta.sessionId}-${response.name}`,
          });
        }
      });

      /**
       * III. Move all the files to a new session folder in the media library
       */

      // 1. prepare the uploaded (not empty) recordings
      const uploadedRecordings: UploadedRecording[] = notEmptyRecordings.map(
        (recording) => ({
          ...recording,
          uploadedFileId:
            fileUploadResponses.find(
              (upload) => path.parse(upload?.name).name === recording.fileName
            )?.id || "",
        })
      );

      // 2. create a new media folder and move the recordings to it
      await createUploadFolderForSession(
        session.meta.boothSlug,
        session.meta.sessionId,
        uploadedRecordings.map(
          (uploadedRecording) => uploadedRecording.uploadedFileId
        )
      );

      /**
       * IV. Create a session in the CMS
       */

      // convert session id to date and time
      const recordingDateAndTime = convertSessionIdToDateAndTime(
        session.meta.sessionId
      );

      // create a new session
      await gqlClient.request(CreateSessionDocument, {
        boothId: await getBoothId(session.meta.boothSlug),
        sessionId: session.meta.sessionId,
        language: session.meta.language as Enum_Session_Language,
        moderated: false,
        narrative: session.audioList,
        date: recordingDateAndTime.date,
        time: recordingDateAndTime.time,
        answers: uploadedRecordings.map((uploadedRecording) => ({
          question: uploadedRecording.questionId,
          transcribed: false,
          original_transcript: "",
          moderated_transcript: "",
          audio: uploadedRecording.uploadedFileId,
        })),
      });

      /**
       * V. Archive the local session folder
       */

      await archiveSession(session.meta.sessionId);
    }
  }
};

/**
 * Upload our recordings to the CMS
 * @param statusCallback
 * @param onFinished
 */
export const uploadToCms = async (
  statusCallback: StatusCallback | null,
  onFinished?: () => void | null
) => {
  // we are starting the upload
  if (statusCallback) await statusCallback("Starting upload to CMS...");

  // let them know, the process is continuing
  if (statusCallback)
    await statusCallback("Inventorising the sessions on our device...");

  // get the recordings folder from settings
  const sessionFolder = await getRecordingsFolder();

  // validate
  if (!sessionFolder || !fs.existsSync(sessionFolder)) {
    if (statusCallback)
      await statusCallback("Session folder is not there or does not exist");
  }

  /**
   * I. Get all the sessions from local hard drive
   */

  // get the sessions on this machine
  let sessions = await new SessionFactory(sessionFolder).getSessions();

  // remove the last session from array, this prevents that the sessions
  // gets uploaded before it is finished
  sessions = sessions.slice(0, sessions.length - 1);

  /**
   * II. Remove all unnessesary sessions
   */

  sessions = await validateAndRemoveUnnecessarySessions(sessions);

  // validate
  if (!sessions || sessions.length === 0) {
    if (statusCallback) await statusCallback("No uploadable sessions found.");
  } else if (statusCallback)
    await statusCallback(
      `Found ${sessions.length} uploadable sessions on this device.`
    );

  /**
   * III. Convert the files to mp3
   */

  // Before we start uploading:
  // 1. Create the filepahts of the current WAV recording
  // 2. Clear the recordings that are empty
  // 3. Join the objects together in an array of strings
  const filePaths = sessions
    .map((session) =>
      session.recordings
        .filter((r) => !r.isEmpty)
        .map((recording) => recording.fullPath)
    )
    .reduce((acc, curr) => acc.concat(curr), []);

  // convert the files
  if (filePaths) {
    try {
      await Mp3Converter.convert(filePaths);
      if (statusCallback && filePaths.length > 0) {
        await statusCallback(`Converted ${filePaths.length} file(s) to mp3.`);
      }
    } catch (e: any) {
      if (statusCallback)
        await statusCallback(`Could not convert ${filePaths} to mp3.`);
    }
  }

  /**
   * IV. Upload the sessions to the CMS
   */

  // upload the sessions
  await uploadSessions(sessions, statusCallback);

  /**
   * V. Finish the process
   */

  if (onFinished) onFinished();
};
