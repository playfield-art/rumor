'use strict';

/**
 * Gets the store for this plugin
 * @returns
 */
export const getCoreStore = () => {
  return strapi.store({ type: 'plugin', name: 'speechmatics' });
};

/**
 * Get a specific service for this plugin
 * @param name
 * @returns
 */
export const getService = (name) => {
  return strapi.plugin('speechmatics').service(name);
};

/**
 * Logs out a message to consolse (with identifier)
 */
export const logMessage = (msg = '') => `[strapi-plugin-speechmatics]: ${msg}`;
