import { finished } from 'stream/promises';
import fs from 'fs';
import { GraphQLUpload } from 'graphql-upload';

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
        type Mutation {
          updateFileFolderPath(fileFolder: FileFolder!): String
        }
      `,
      resolvers: {
        Mutation: {
          updateFileFolderPath: async (parent, { fileFolder }, context, info) => {
            const { ids, folderPath } = fileFolder;
            const promises = ids.map(async (id) => {
              return strapi.db
                .connection('public.files')
                .where('id', '=', Number(id))
                .update({
                  folder_path: folderPath,
                });
            });
            await Promise.all(promises);
            return 'Success!!';
          }
        }
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
