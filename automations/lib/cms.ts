import path from "path";
import fs from "fs";
import "dotenv/config";
import {
  GetLanguageRelationIdDocument,
  GetNextUnmoderatedSessionsDocument,
  ModerateAnswerDocument,
  UpdateSessionModeratedWithAiDocument,
} from "cms-types/gql/graphql";
import { GraphQLClient } from "graphql-request";

let graphQlClient: GraphQLClient = null;

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
const getGraphQLClient = async (): Promise<GraphQLClient> => {
  if (!graphQlClient) {
    graphQlClient = new GraphQLClient(`${await getApiEndpoint()}/graphql`, {
      headers: {
        contentType: "application/json",
        authorization: `Bearer ${await getApiToken()}`,
      },
    });
    return graphQlClient;
  } else {
    return graphQlClient;
  }
};

/**
 * Get the last unmorderated sessions
 */
export const getLanguageRelationId = async (short: string) => {
  // get the graphql client
  const gqlClient = await getGraphQLClient();

  // do the request
  const languageRelation = await gqlClient.request(
    GetLanguageRelationIdDocument,
    {
      short,
    }
  );

  if (languageRelation.languages.data.length === 0) return "1";
  else return languageRelation.languages.data[0].id;
};

/**
 * Get the last unmorderated sessions
 */
export const getNextUnmoderatedSessions = async () => {
  // get the graphql client
  const gqlClient = await getGraphQLClient();

  // do the request
  return await gqlClient.request(GetNextUnmoderatedSessionsDocument);
};

/**
 * Get the last unmorderated sessions
 */
export const moderateAnswer = async (
  answerId: string,
  moderated_transcript: string = "",
  common_language: string = ""
) => {
  // get the graphql client
  const gqlClient = await getGraphQLClient();

  // do the request
  await gqlClient.request(ModerateAnswerDocument, {
    answerId,
    moderated_transcript,
    common_language,
  });
};

/**
 * Update a session to moderated with AI
 * @param sessionId
 * @param languageRelationId
 */
export const updateSessionModeratedWithAI = async (
  sessionId: string,
  languageRelationId: string
) => {
  // get the graphql client
  const gqlClient = await getGraphQLClient();

  // do the request
  await gqlClient.request(UpdateSessionModeratedWithAiDocument, {
    id: sessionId,
    languageRelationId,
  });
};
