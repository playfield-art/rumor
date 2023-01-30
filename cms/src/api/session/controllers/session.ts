/**
 * session controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::session.session', ({ strapi }) => ({
  async transcription(ctx) {
    try {
      console.log(ctx.request.body);
      ctx.body = "Ok"
    } catch (err) {
      ctx.body = err;
    }
  },
}));
