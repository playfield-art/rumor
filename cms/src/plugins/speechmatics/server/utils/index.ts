'use strict';

export const getCoreStore = () => {
  return strapi.store({ type: 'plugin', name: 'speechmatics' });
};

export const getService = (name) => {
  return strapi.plugin('speechmatics').service(name);
};

export const logMessage = (msg = '') => `[strapi-plugin-speechmatics]: ${msg}`;
