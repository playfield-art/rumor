'use strict';

const { getService } = require('../utils');

/**
 * Speechmatics controller
 *
 * @description: A set of functions called "actions" of the `speechmatics` plugin.
 */

export default {
  /**
   * This is just for testing purpose
   * @param ctx
   */
  hello: async(ctx) => {
    ctx.send({
      message: 'hello'
    });
  },

  /**
   * Start transcribing a session
   * @param ctx
   */
  transcribeSession: async (ctx) => {
    const { body } = ctx.request;
    try {
      const { sessionId } = body;
      await getService('speechmatics').transcribeSession(sessionId);
      ctx.send({ message: `Jobs for session ${sessionId} are registered!` });
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  /**
   * The callback when a transcription is ready
   * @param ctx
   */
  notify: async (ctx) => {
    const { url } = ctx.request;
    try {
      const fullUrl = new URL(`https://example.com${url}`);
      const id = fullUrl.searchParams.get('id');
      const text = await getService('speechmatics').getTextFromJob(id);
      console.log(text);
      ctx.send({ text });
    } catch (err) {
      ctx.throw(500, err)
    }
  }
};
