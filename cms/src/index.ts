import { finished } from "stream/promises";
import fs from "fs";
import { GraphQLUpload } from "graphql-upload";

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {
    const extensionService = strapi.service("plugin::graphql.extension");

    // Previous code from before
    extensionService.use(({ strapi }) => ({}));

    // Going to be our custom query resolver to get all authors and their details.
    extensionService.use(({ strapi }) => ({
      typeDefs: `
        input FileFolder {
          ids: [ID]!
          folderPath: String
        }
        input ModeratedAnswer {
          id: ID!
          moderated_transcript: String
          common_language: String
        }
        type ModeratedAnswerOutput {
          status: String
          moderated_transcript: String
          common_language: String
        }
        type Mutation {
          updateFileFolderPath(fileFolder: FileFolder!): String
          moderateAnswer(moderatedAnswer: ModeratedAnswer): ModeratedAnswerOutput
          makeSessionAiModerated(sessionId: ID): ID
        }
      `,
      resolvers: {
        Mutation: {
          updateFileFolderPath: async (
            parent,
            { fileFolder },
            context,
            info
          ) => {
            const { ids, folderPath } = fileFolder;
            const promises = ids.map(async (id) => {
              return strapi.db
                .connection("public.files")
                .where("id", "=", Number(id))
                .update({
                  folder_path: folderPath,
                });
            });
            await Promise.all(promises);
            return "Success";
          },
          moderateAnswer: async (
            parent,
            { moderatedAnswer },
            context,
            info
          ) => {
            try {
              // get the moderated transcript from params
              const { id, moderated_transcript, common_language } =
                moderatedAnswer;

              // update the moderated transcript
              await strapi.db
                .connection("public.components_answers_anwsers")
                .where("id", "=", id)
                .update({
                  moderated_transcript,
                });

              // update the common language
              await strapi.db
                .connection("public.components_answers_anwsers")
                .where("id", "=", id)
                .update({
                  common_language,
                });

              return {
                status: "Succes",
                moderated_transcript,
                common_language,
              };
            } catch (e) {
              return {
                status: `Error... ${e.message}`,
                moderated_transcript: "",
                common_language: "",
              };
            }
          },
        },
      },
      resolversConfig: {},
    }));
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/*{ strapi }*/) {},
};
