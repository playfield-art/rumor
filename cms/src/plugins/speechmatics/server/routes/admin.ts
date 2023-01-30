import { StrapiRoute } from "strapi-typed";

const routes: StrapiRoute[] = [
  {
    method: 'GET',
    path: '/settings',
    handler: 'settings.getSettings',
    config: {
      policies: []
    },
  },
  {
    method: 'POST',
    path: '/settings',
    handler: 'settings.setSettings',
    config: {
      policies: [],
    },
  }
];

export default routes;
