'use strict';

const { getService } = require('../utils');

/**
 * Settings controller
 *
 * @description: A set of functions called "actions" of the `speechmatics` plugin.
 */

export default {
  getSettings: async (ctx) => {
    try {
      const config = await getService('settings').getSettings();
      ctx.send(config);
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  setSettings: async (ctx) => {
    const { body } = ctx.request;
    try {
      await getService('settings').setSettings(body);
      ctx.body = getService('settings').getSettings();
    } catch (err) {
      ctx.throw(500, err);
    }
  },
};
