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
} from "@shared/interfaces";
import fsExtra from "fs-extra";
import { narrativeChapters } from "../consts";
import {
  getArchiveFolder,
  getRecordingsFolder,
  moveFolder,
} from "./filesystem";

let graphQLClient: GraphQLClient | null = null;

/**
 * Get the API endpoint
 * @returns
 */
const getApiEndpoint = (): string => process.env.CMS_API_URL || "";

/**
 * Get the API token
 * @returns
 */
const getApiToken = (): string => process.env.CMS_API_TOKEN || "";

/**
 * Returns a GraphQL client to work with
 * @returns
 */
const getGraphQLClient = (): GraphQLClient => {
  if (!graphQLClient) {
    graphQLClient = new GraphQLClient(getApiEndpoint(), {
      headers: {
        authorization: `Bearer ${getApiToken()}`,
      },
    });
  }
  return graphQLClient;
};

/**
 * Gets the narrative from the CMS
 * @returns
 */
export const getNarrative = async () => {
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

  console.log("Fetching the narrative data from CMS...");

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
      ] = await getGraphQLClient().request(GetChaptersDocument, {
        narrative_part: narrativePart,
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
  const { uploadFolders } = await getGraphQLClient().request(
    GetLastPathIdDocument
  );
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
  // find the upload folder in the root of our media library
  const { uploadFolders } = await getGraphQLClient().request(
    FindUploadFolderDocument,
    { folderName: boothSlug }
  );

  // if we found data, return that folder
  if (uploadFolders?.data && uploadFolders.data.length > 0) {
    return uploadFolders.data[0].id || "";
  }

  // we didn't find data, so let's create the folder
  const lastPathId = await getLastPathId();
  const newPathId = lastPathId + 1;
  await getGraphQLClient().request(CreateUploadFolderInRootDocument, {
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
  // get the upload folder for a booth
  const uploadFolderIdForBooth = await getUploadFolderIdForBooth(boothSlug);

  // find the upload folder for this session in the booth folder
  const uploadFolderForSession = await getGraphQLClient().request(
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
  // get the folder id for a booth
  const uploadFolderIdForBooth = await getUploadFolderIdForBooth(boothSlug);

  // get the last id path and create a new path id
  const lastPathId = await getLastPathId();
  const newPathId = lastPathId + 1;

  // create a new upload folder in a session
  return getGraphQLClient().request(CreateUploadFolderInParentDocument, {
    pathId: newPathId,
    path: `/${sessionId}`,
    name: sessionId,
    files,
    parent: uploadFolderIdForBooth,
  });
};

/**
 * Upload Sessions
 * @param sessions
 */
export const uploadSessions = async (sessions: Session[]) => {
  // loop over the different sessions and create worker promises
  const uploadPromises = sessions.map(async (session) => {
    // let them now
    console.log(`Uploading session ${session.meta.sessionId} started...`);

    // check if the upload folder for the session exists
    const doesFolderForSessionExist = await uploadFolderForSessionExists(
      session.meta.boothSlug,
      session.meta.sessionId
    );

    // validate
    if (doesFolderForSessionExist) {
      console.log(
        `Upload folder for session ${session.meta.sessionId} in booth ${session.meta.boothSlug} already exists`
      );
      return;
    }

    // get the readstreams for every file we need to upload
    const files = {
      files: session.recordings.map((r) =>
        fsExtra.createReadStream(r.fullPath)
      ),
    };

    // upload the files
    const { multipleUpload } = await getGraphQLClient().request(
      UploadFilesDocument,
      files
    );

    // change the filenames, then we can filter better in our CMS
    await Promise.all(
      multipleUpload.map(async (upload) => {
        if (upload?.data && upload?.data.id && upload.data.attributes) {
          // update file name with the correct name
          await getGraphQLClient().request(UpdateFileNameDocument, {
            id: upload?.data.id,
            fileName: `${session.meta.boothSlug}-${session.meta.sessionId}-${upload.data.attributes.name}`,
          });
          console.log(`Uploaded ${upload.data.attributes.name}.`);
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

    // create a new session
    await getGraphQLClient().request(CreateSessionDocument, {
      boothId: "1",
      sessionId: session.meta.sessionId,
      language: session.meta.language as Enum_Session_Language,
      moderated: false,
      narrative: session.audioList,
      answers: uploadedRecordings.map((uploadedRecording) => ({
        question: uploadedRecording.questionId,
        transcribed: false,
        original_transcript: "",
        moderated_transcript: "",
        audio: uploadedRecording.uploadedFileId,
      })),
    });

    // move folder to the archive directory
    await moveFolder(
      `${await getRecordingsFolder()}/${session.meta.sessionId}`,
      `${await getArchiveFolder()}/${session.meta.sessionId}`
    );
  });

  // Upload everyting
  await Promise.all(uploadPromises);

  // let them now
  console.log("All sessions were uploaded.");
};
