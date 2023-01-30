import React from 'react';
import { prefixPluginTranslations } from '@strapi/helper-plugin';
import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import Initializer from './components/Initializer';
import TranscribeButton from './components/TranscribeButton';

const name = pluginPkg.strapi.name;

export default {
  register(app) {
    const plugin = {
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      name,
    };

    app.createSettingSection({
        id: pluginId,
        intlLabel: {
          id: `${pluginId}.plugin.name`,
          defaultMessage: 'Speechmatics',
        },
      },
      [
        {
          intlLabel: {
            id: `${pluginId}.plugin.name`,
            defaultMessage: 'General settings',
          },
          id: 'settings',
          to: `/settings/${pluginId}`,
          Component: async () => {
            return import('./pages/Settings');
          },
        },
      ]
    );

    app.registerPlugin(plugin);
  },

  bootstrap(app) {
    app.injectContentManagerComponent('editView', 'right-links', {
      name: 'transcribeButton',
      Component: TranscribeButton,
    });
  },

  async registerTrads(app) {
    const { locales } = app;

    const importedTrads = await Promise.all(
      locales.map(locale => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
