import { Strapi } from '@strapi/strapi';
import { getService } from './utils';

export default ({ strapi }: { strapi: Strapi }) => {
  strapi.cron.add({
    '*/5 * * * * *': ({ strapi }) => {
      if(process.env.NODE_ENV === "production" ) {
        getService('speechmatics').cronUntranscribedAnswers(20);
      }
    },
  })
};
