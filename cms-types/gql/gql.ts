/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel-plugin for production.
 */
const documents = {
    "mutation createSession($boothId: ID!, $sessionId: String!, $language: ENUM_SESSION_LANGUAGE!, $moderated: Boolean = false, $answers: [ComponentAnswersAnwserInput!], $narrative: JSON, $date: Date, $time: Time) {\n  createSession(\n    data: {booth: $boothId, session_id: $sessionId, language: $language, moderated: $moderated, narrative: $narrative, answers: $answers, date: $date, time: $time}\n  ) {\n    data {\n      id\n    }\n  }\n}": types.CreateSessionDocument,
    "mutation createUploadFolderInParent($name: String, $path: String, $pathId: Int, $parent: ID, $files: [ID]) {\n  createUploadFolder(\n    data: {name: $name, path: $path, pathId: $pathId, parent: $parent, files: $files}\n  ) {\n    data {\n      id\n    }\n  }\n}": types.CreateUploadFolderInParentDocument,
    "mutation createUploadFolderInRoot($name: String, $path: String, $pathId: Int) {\n  createUploadFolder(data: {name: $name, path: $path, pathId: $pathId}) {\n    data {\n      attributes {\n        name\n      }\n    }\n  }\n}": types.CreateUploadFolderInRootDocument,
    "query findUploadFolder($folderName: String) {\n  uploadFolders(filters: {name: {eq: $folderName}}) {\n    data {\n      id\n      attributes {\n        name\n      }\n    }\n  }\n}": types.FindUploadFolderDocument,
    "query findUploadFolderInParent($parent: ID, $sessionId: String) {\n  uploadFolder(id: $parent) {\n    data {\n      attributes {\n        name\n        children(filters: {name: {eq: $sessionId}}) {\n          data {\n            attributes {\n              name\n            }\n          }\n        }\n      }\n    }\n  }\n}": types.FindUploadFolderInParentDocument,
    "query getBoothId($slug: String) {\n  booths(filters: {slug: {eq: $slug}}) {\n    data {\n      id\n    }\n  }\n}": types.GetBoothIdDocument,
    "query getChapters($narrative_part: String) {\n  chapters(filters: {narrative_part: {eq: $narrative_part}}) {\n    data {\n      id\n      attributes {\n        title\n        soundscape {\n          data {\n            attributes {\n              ext\n              url\n            }\n          }\n        }\n        narrative_part\n        blocks {\n          __typename\n          ... on ComponentBlocksChapterQuestionBlock {\n            question {\n              data {\n                id\n                attributes {\n                  title\n                  description\n                  audio {\n                    language\n                    audio {\n                      data {\n                        attributes {\n                          ext\n                          url\n                        }\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n          ... on ComponentBlocksChapterVoiceOverBlock {\n            voice_over {\n              data {\n                id\n                attributes {\n                  title\n                  description\n                  audio {\n                    language\n                    audio {\n                      data {\n                        attributes {\n                          ext\n                          url\n                        }\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}": types.GetChaptersDocument,
    "query getLastPathId {\n  uploadFolders(sort: \"pathId:desc\", pagination: {limit: 1}) {\n    data {\n      attributes {\n        pathId\n      }\n    }\n  }\n}": types.GetLastPathIdDocument,
    "mutation updateFileName($id: ID!, $fileName: String!) {\n  updateFileInfo(id: $id, info: {name: $fileName}) {\n    data {\n      id\n      attributes {\n        name\n      }\n    }\n  }\n}": types.UpdateFileNameDocument,
    "mutation uploadFiles($files: [Upload]!) {\n  multipleUpload(files: $files) {\n    data {\n      id\n      attributes {\n        name\n      }\n    }\n  }\n}": types.UploadFilesDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation createSession($boothId: ID!, $sessionId: String!, $language: ENUM_SESSION_LANGUAGE!, $moderated: Boolean = false, $answers: [ComponentAnswersAnwserInput!], $narrative: JSON, $date: Date, $time: Time) {\n  createSession(\n    data: {booth: $boothId, session_id: $sessionId, language: $language, moderated: $moderated, narrative: $narrative, answers: $answers, date: $date, time: $time}\n  ) {\n    data {\n      id\n    }\n  }\n}"): (typeof documents)["mutation createSession($boothId: ID!, $sessionId: String!, $language: ENUM_SESSION_LANGUAGE!, $moderated: Boolean = false, $answers: [ComponentAnswersAnwserInput!], $narrative: JSON, $date: Date, $time: Time) {\n  createSession(\n    data: {booth: $boothId, session_id: $sessionId, language: $language, moderated: $moderated, narrative: $narrative, answers: $answers, date: $date, time: $time}\n  ) {\n    data {\n      id\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation createUploadFolderInParent($name: String, $path: String, $pathId: Int, $parent: ID, $files: [ID]) {\n  createUploadFolder(\n    data: {name: $name, path: $path, pathId: $pathId, parent: $parent, files: $files}\n  ) {\n    data {\n      id\n    }\n  }\n}"): (typeof documents)["mutation createUploadFolderInParent($name: String, $path: String, $pathId: Int, $parent: ID, $files: [ID]) {\n  createUploadFolder(\n    data: {name: $name, path: $path, pathId: $pathId, parent: $parent, files: $files}\n  ) {\n    data {\n      id\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation createUploadFolderInRoot($name: String, $path: String, $pathId: Int) {\n  createUploadFolder(data: {name: $name, path: $path, pathId: $pathId}) {\n    data {\n      attributes {\n        name\n      }\n    }\n  }\n}"): (typeof documents)["mutation createUploadFolderInRoot($name: String, $path: String, $pathId: Int) {\n  createUploadFolder(data: {name: $name, path: $path, pathId: $pathId}) {\n    data {\n      attributes {\n        name\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query findUploadFolder($folderName: String) {\n  uploadFolders(filters: {name: {eq: $folderName}}) {\n    data {\n      id\n      attributes {\n        name\n      }\n    }\n  }\n}"): (typeof documents)["query findUploadFolder($folderName: String) {\n  uploadFolders(filters: {name: {eq: $folderName}}) {\n    data {\n      id\n      attributes {\n        name\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query findUploadFolderInParent($parent: ID, $sessionId: String) {\n  uploadFolder(id: $parent) {\n    data {\n      attributes {\n        name\n        children(filters: {name: {eq: $sessionId}}) {\n          data {\n            attributes {\n              name\n            }\n          }\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query findUploadFolderInParent($parent: ID, $sessionId: String) {\n  uploadFolder(id: $parent) {\n    data {\n      attributes {\n        name\n        children(filters: {name: {eq: $sessionId}}) {\n          data {\n            attributes {\n              name\n            }\n          }\n        }\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query getBoothId($slug: String) {\n  booths(filters: {slug: {eq: $slug}}) {\n    data {\n      id\n    }\n  }\n}"): (typeof documents)["query getBoothId($slug: String) {\n  booths(filters: {slug: {eq: $slug}}) {\n    data {\n      id\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query getChapters($narrative_part: String) {\n  chapters(filters: {narrative_part: {eq: $narrative_part}}) {\n    data {\n      id\n      attributes {\n        title\n        soundscape {\n          data {\n            attributes {\n              ext\n              url\n            }\n          }\n        }\n        narrative_part\n        blocks {\n          __typename\n          ... on ComponentBlocksChapterQuestionBlock {\n            question {\n              data {\n                id\n                attributes {\n                  title\n                  description\n                  audio {\n                    language\n                    audio {\n                      data {\n                        attributes {\n                          ext\n                          url\n                        }\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n          ... on ComponentBlocksChapterVoiceOverBlock {\n            voice_over {\n              data {\n                id\n                attributes {\n                  title\n                  description\n                  audio {\n                    language\n                    audio {\n                      data {\n                        attributes {\n                          ext\n                          url\n                        }\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query getChapters($narrative_part: String) {\n  chapters(filters: {narrative_part: {eq: $narrative_part}}) {\n    data {\n      id\n      attributes {\n        title\n        soundscape {\n          data {\n            attributes {\n              ext\n              url\n            }\n          }\n        }\n        narrative_part\n        blocks {\n          __typename\n          ... on ComponentBlocksChapterQuestionBlock {\n            question {\n              data {\n                id\n                attributes {\n                  title\n                  description\n                  audio {\n                    language\n                    audio {\n                      data {\n                        attributes {\n                          ext\n                          url\n                        }\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n          ... on ComponentBlocksChapterVoiceOverBlock {\n            voice_over {\n              data {\n                id\n                attributes {\n                  title\n                  description\n                  audio {\n                    language\n                    audio {\n                      data {\n                        attributes {\n                          ext\n                          url\n                        }\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query getLastPathId {\n  uploadFolders(sort: \"pathId:desc\", pagination: {limit: 1}) {\n    data {\n      attributes {\n        pathId\n      }\n    }\n  }\n}"): (typeof documents)["query getLastPathId {\n  uploadFolders(sort: \"pathId:desc\", pagination: {limit: 1}) {\n    data {\n      attributes {\n        pathId\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation updateFileName($id: ID!, $fileName: String!) {\n  updateFileInfo(id: $id, info: {name: $fileName}) {\n    data {\n      id\n      attributes {\n        name\n      }\n    }\n  }\n}"): (typeof documents)["mutation updateFileName($id: ID!, $fileName: String!) {\n  updateFileInfo(id: $id, info: {name: $fileName}) {\n    data {\n      id\n      attributes {\n        name\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation uploadFiles($files: [Upload]!) {\n  multipleUpload(files: $files) {\n    data {\n      id\n      attributes {\n        name\n      }\n    }\n  }\n}"): (typeof documents)["mutation uploadFiles($files: [Upload]!) {\n  multipleUpload(files: $files) {\n    data {\n      id\n      attributes {\n        name\n      }\n    }\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;