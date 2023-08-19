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
   * Start the training
   * @param ctx The context
   */
  startTraining: async(ctx) => {
    try {
      await getService('speechmatics').startTraining();
    } catch(err) {
      ctx.throw(500, err);
    }
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
   * Start translating a session
   * @param ctx
   */
  translateSession: async (ctx) => {
    const { body } = ctx.request;
    try {
      const { sessionId } = body;
      await getService('speechmatics').translateSession(sessionId);
      ctx.send({ message: `Translations for ${sessionId} are done!` });
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  /**
   * Get the current training state
   * @param ctx
   */
  trainingState: async (ctx) => {
    try {
      const state = await getService('speechmatics').getTrainingState();
      ctx.send(state);
    } catch(err) {
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
      await getService('speechmatics').addTextToAnswerViaJobId(text, id);
      ctx.send({ jobId: id, text });
    } catch (err) {
      ctx.throw(500, err)
    }
  }
};
