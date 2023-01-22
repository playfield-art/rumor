import { CreateUploadFolderForSessionDocument, CreateUploadFolderInRootDocument, FindUploadFolderDocument, GetChaptersDocument, GetLastPathIdDocument, GetUploadFolderForSessionDocument, UpdateFileNameDocument, UploadFilesDocument } from 'cms-types/gql/graphql'
import { GraphQLClient } from 'graphql-request';
import { Narrative, Chapter, ChapterBlock, ChapterBlockType, Session } from '@shared/interfaces';
import { narrativeChapters } from '../consts';
import fsExtra from 'fs-extra';

let graphQLClient: GraphQLClient | null = null;

/**
 * Get the API endpoint
 * @returns
 */
const getApiEndpoint = (): string => {
  return process.env.CMS_API_URL || ""
}

/**
 * Get the API token
 * @returns
 */
const getApiToken = (): string => {
  return process.env.CMS_API_TOKEN || ""
}

/**
 * Returns a GraphQL client to work with
 * @returns
 */
const getGraphQLClient = (): GraphQLClient => {
  if(!graphQLClient) {
    graphQLClient = new GraphQLClient(getApiEndpoint(), {
      headers: {
        authorization: `Bearer ${getApiToken()}`,
      },
    })
  }
  return graphQLClient;
}

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
    outroChapters: []
  }

  // loop over each narrative part and get the chapter
  for(const narrativePart of narrativeChapters) {
    // get the data
    const data = await getGraphQLClient().request(GetChaptersDocument, { narrative_part: narrativePart });

    // only if there are chapters available
    if(data.chapters?.data.length && data.chapters?.data.length > 0) {
      output[`${narrativePart}Chapters` as keyof Narrative] = data.chapters.data.map(({ attributes }) => {
        // transform all the blocks in this chapter
        const chapterBlocks: ChapterBlock[] | undefined = attributes?.blocks?.map(b => {

          // define the chapter block output
          const chapterBlock: ChapterBlock = {
            type: b?.__typename === 'ComponentBlocksChapterQuestionBlock' ? ChapterBlockType.Question : ChapterBlockType.VoiceOver,
            title: "",
            cms_id: "",
            description: "",
            audio: []
          }

          // chapterblocks behave different based on type
          if(b?.__typename === "ComponentBlocksChapterQuestionBlock") {
            chapterBlock.title = b.question?.data?.attributes?.title || "";
            chapterBlock.description = b.question?.data?.attributes?.description || "";
            chapterBlock.cms_id = b.question?.data?.id || "9999";
            chapterBlock.audio = b.question?.data?.attributes?.audio?.map(a => ({
              audioUrl: a?.audio.data?.attributes?.url || "",
              language: a?.language || "unknown",
              ext: a?.audio.data?.attributes?.ext || ""
            })) || []
          } else if(b?.__typename === "ComponentBlocksChapterVoiceOverBlock") {
            chapterBlock.title = b.voice_over?.data?.attributes?.title || "";
            chapterBlock.description = b.voice_over?.data?.attributes?.description || "";
            chapterBlock.cms_id = b.voice_over?.data?.id || "9999";
            chapterBlock.audio = b.voice_over?.data?.attributes?.audio?.map(a => ({
              audioUrl: a?.audio.data?.attributes?.url || "",
              language: a?.language || "unknown",
              ext: a?.audio.data?.attributes?.ext || ""
            })) || []
          }

          // returns the chapter block
          return chapterBlock;
        })

        return {
          title: attributes?.title,
          soundScape: attributes?.soundscape?.data ? {
            audioUrl: attributes?.soundscape?.data?.attributes?.url,
            ext: attributes?.soundscape?.data?.attributes?.ext,
          } : null,
          narrativePart: attributes?.narrative_part,
          blocks: chapterBlocks
        } as Chapter
      });
    }
  }

  // return the narrative
  return output;
}


/**
 * Get the last path id of an uploadfolder
 * @returns
 */
export const getLastPathId = async () => {
  const { uploadFolders } = await getGraphQLClient().request(GetLastPathIdDocument);
  let lastPathId = 0;
  if(uploadFolders?.data && uploadFolders.data.length > 0) {
    lastPathId = (uploadFolders.data.pop()?.attributes?.pathId) || 0;
  }
  return lastPathId;
}

/**
 * Get the upload folder id for a booth
 */
export const getUploadFolderIdForBooth = async (boothId: string): Promise<string> => {
  const { uploadFolders } = await getGraphQLClient().request(FindUploadFolderDocument, { folderName: boothId });
  if(uploadFolders?.data && uploadFolders.data.length > 0) {
    return uploadFolders.data[0].id || "";
  } else {
    let lastPathId = await getLastPathId();
    await getGraphQLClient().request(
      CreateUploadFolderInRootDocument,
      {
        name: boothId,
        path: `/${boothId}`,
        pathId: ++lastPathId
      }
    );
    return await getUploadFolderIdForBooth(boothId);
  }
}

/**
 * Check if a session id for a booth exists
 * @param boothId The booth id
 * @param sessionId The session id
 * @returns
 */
const uploadFolderForSessionExists = async (boothId: string, sessionId: string) => {
  const uploadFolderIdForBooth = await getUploadFolderIdForBooth(boothId);
  const uploadFolderForSession = await getGraphQLClient().request(GetUploadFolderForSessionDocument, {
    parent: uploadFolderIdForBooth,
    sessionId: sessionId}
  );
  return (uploadFolderForSession.uploadFolder?.data?.attributes?.children?.data || []).length > 0;
}

/**
 * Create an upload folder for a session
 */
export const createUploadFolderForSession = async (boothId: string, sessionId: string, files: string[]) => {


  // get the folder id for a booth
  const uploadFolderIdForBooth = await getUploadFolderIdForBooth(boothId);

  // get the last id path
  let lastPathId = await getLastPathId();

  // create a new upload folder in a session
  return await getGraphQLClient().request(CreateUploadFolderForSessionDocument, {
    pathId: ++lastPathId,
    path: `${sessionId}`,
    name:sessionId,
    files,
    parent: uploadFolderIdForBooth
  });
}

/**
 * Upload Sessions
 * @param sessions
 */
export const uploadSessions = async(sessions: Session[]) => {
  // loop over the different sessions
  for(const session of sessions) {
    // let them now
    console.log(`Uploading session ${session.meta.sessionId}...`);

    // validate
    if(await uploadFolderForSessionExists(session.meta.boothId, session.meta.sessionId)) {
      console.log(`Upload folder for session ${session.meta.sessionId} in booth ${session.meta.boothId} already exists`);
      continue;
    }

    // get the files
    const files = {
      files: session.recordings.map(r => fsExtra.createReadStream(r.fullPath))
    }

    // change filenames
    const fileIds = [];
    const { multipleUpload } = await getGraphQLClient().request(UploadFilesDocument, files);
    for(const upload of multipleUpload) {
      if(upload?.data && upload?.data.id && upload.data.attributes) {
        // add to file ids
        fileIds.push(upload.data.id);
console.log(upload.data.attributes.name);
        // update file name with the correct name
        await getGraphQLClient().request(UpdateFileNameDocument, {
          id: upload?.data.id,
          fileName: `${session.meta.boothId}-${session.meta.sessionId}-${upload.data.attributes.name}` }
        );
      }
    }

    // add the new added files to a session folder
    await createUploadFolderForSession(session.meta.boothId, session.meta.sessionId, fileIds);
  }

  // let them now
  console.log('All sessions were uploaded.');
}