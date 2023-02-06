import {
  CreateUploadFolderInParentDocument,
  CreateUploadFolderInRootDocument,
  FindUploadFolderDocument,
  GetChaptersDocument,
  GetLastPathIdDocument,
  FindUploadFolderInParentDocument,
  UpdateFileNameDocument,
  UploadFilesDocument,
  CreateSessionDocument,
  GetBoothIdDocument,
  Enum_Session_Language,
} from "cms-types/gql/graphql";
import { GraphQLClient } from "graphql-request";
import {
  Narrative,
  Chapter,
  ChapterBlock,
  ChapterBlockType,
  Session,
  NarrativeChapterData,
  UploadedRecording,
  StatusCallback,
} from "@shared/interfaces";
import fsExtra from "fs-extra";
import { Utils } from "@shared/utils";
import { narrativeChapters } from "../consts";
import {
  getArchiveFolder,
  getRecordingsFolder,
  moveFolder,
} from "./filesystem";
import { convertSessionIdToDateAndTime } from "./sessions/SessionUtils";
import { Exception } from "./exceptions/Exception";
import SettingHelper from "./settings/SettingHelper";

let graphQLClient: GraphQLClient | null = null;

/**
 * Get the API endpoint
 * @returns
 */
const getApiEndpoint = async (): Promise<string> => {
  const rumorCmsApiUrl = SettingHelper.getRumorCmsApiUrl();
  if (!rumorCmsApiUrl) {
    throw new Exception({
      where: "getApiEndpoint",
      message: "The endpoint of the API was not defined.",
    });
  }
  return rumorCmsApiUrl;
};

/**
 * Get the API token
 * @returns
 */
const getApiToken = async (): Promise<string> => {
  const rumorCmsApiToken = SettingHelper.getRumorCmsApiToken();
  if (!rumorCmsApiToken) {
    throw new Exception({
      where: "getApiToken",
      message: "The token of the API was not defined.",
    });
  }
  return rumorCmsApiToken;
};

/**
 * Returns a GraphQL client to work with
 * @returns
 */
const getGraphQLClient = async (): Promise<GraphQLClient> => {
  if (!graphQLClient) {
    graphQLClient = new GraphQLClient(await getApiEndpoint(), {
      headers: {
        authorization: `Bearer ${await getApiToken()}`,
      },
    });
  }
  return graphQLClient;
};

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
            attributes?.blocks?.map((b) => {
              // define the chapter block output
              const chapterBlock: ChapterBlock = {
                type:
                  b?.__typename === "ComponentBlocksChapterQuestionBlock"
                    ? ChapterBlockType.Question
                    : ChapterBlockType.VoiceOver,
                title: "",
                cms_id: "",
                description: "",
                audio: [],
              };

              // chapterblocks behave different based on type
              if (b?.__typename === "ComponentBlocksChapterQuestionBlock") {
                chapterBlock.title = b.question?.data?.attributes?.title || "";
                chapterBlock.description =
                  b.question?.data?.attributes?.description || "";
                chapterBlock.cms_id = b.question?.data?.id || "9999";
                chapterBlock.audio =
                  b.question?.data?.attributes?.audio?.map((a) => ({
                    audioUrl: a?.audio.data?.attributes?.url || "",
                    language: a?.language || "unknown",
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
                chapterBlock.audio =
                  b.voice_over?.data?.attributes?.audio?.map((a) => ({
                    audioUrl: a?.audio.data?.attributes?.url || "",
                    language: a?.language || "unknown",
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

  // create a new upload folder in a session
  return gqlClient.request(CreateUploadFolderInParentDocument, {
    pathId: newPathId,
    path: `/${sessionId}`,
    name: sessionId,
    files,
    parent: uploadFolderIdForBooth,
  });
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
  const uploadPromises = sessions.map(async (session) => {
    // let them now
    if (statusCallback)
      statusCallback(`Uploading session ${session.meta.sessionId} started...`);

    // check if the upload folder for the session exists
    const doesFolderForSessionExist = await uploadFolderForSessionExists(
      session.meta.boothSlug,
      session.meta.sessionId
    );

    // validate
    if (doesFolderForSessionExist) {
      // let them now
      if (statusCallback)
        statusCallback(
          `Upload folder for session "${session.meta.sessionId}" on booth "${session.meta.boothSlug}" already exists`
        );

      // archive the folder
      await archiveSession(session.meta.sessionId);

      // exit here
      return;
    }

    // get the readstreams for every file we need to upload
    const files = {
      files: session.recordings.map((r) =>
        fsExtra.createReadStream(r.fullPath)
      ),
    };

    // upload the files
    const { multipleUpload } = await gqlClient.request(
      UploadFilesDocument,
      files
    );

    // change the filenames, then we can filter better in our CMS
    await Promise.all(
      multipleUpload.map(async (upload) => {
        if (upload?.data && upload?.data.id && upload.data.attributes) {
          // update file name with the correct name
          await gqlClient.request(UpdateFileNameDocument, {
            id: upload?.data.id,
            fileName: `${session.meta.boothSlug}-${session.meta.sessionId}-${upload.data.attributes.name}`,
          });

          // let them know
          if (statusCallback)
            statusCallback(`Uploaded ${upload.data.attributes.name}`);
        }
      })
    );

    // get the file ids form the data
    const uploadedRecordings: UploadedRecording[] = session.recordings.map(
      (recording) => ({
        ...recording,
        uploadedFileId:
          multipleUpload.find(
            (upload) => upload?.data?.attributes?.name === recording.fileName
          )?.data?.id || "",
      })
    );

    // add the new added files to a session folder
    await createUploadFolderForSession(
      session.meta.boothSlug,
      session.meta.sessionId,
      uploadedRecordings.map(
        (uploadedRecording) => uploadedRecording.uploadedFileId
      )
    );

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

    // archive the session
    await archiveSession(session.meta.sessionId);
  });

  // Upload everyting
  await Promise.all(uploadPromises);

  // let them know
  if (statusCallback) statusCallback("All sessions were uploaded.");
};
