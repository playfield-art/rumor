import { Strapi } from '@strapi/strapi';
import { Settings } from '../../types';
import { getCoreStore } from '../utils';

/**
 * The default config
 */
const defaultConfig = {
  speechmaticsApiToken: "",
  translatorApiToken: ""
}

/**
 * Creates the default configuration
 * @param settings
 * @returns
 */
async function createDefaultConfig(settings: Settings) {
  // get the plugin store
  const pluginStore = getCoreStore();

  // the value to set
  const value = { ...settings };

  // set the store
  await pluginStore.set({ key: 'settings', value });

  // return the newly set store
  return pluginStore.get({ key: 'settings' });
}

export default ({ strapi }: { strapi: Strapi }) => ({
  /**
   * Get the settings out of store
   * @returns
   */
  async getSettings() {
    let config = await getCoreStore().get({ key: 'settings' });
    if (!config) {
      config = await createDefaultConfig(defaultConfig);
    }
    return config;
  },

  /**
   * Saves the setting in the store
   * @param settings
   * @returns
   */
  async setSettings(settings) {
    const value = settings;
    await getCoreStore().set({ key: 'settings', value });
    return getCoreStore().get({ key: 'settings' });
  },
});

