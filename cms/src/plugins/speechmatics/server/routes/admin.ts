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
  },
  {
    method: "POST",
    path: "/transcribeSession",
    handler: "speechmatics.transcribeSession",
    config: {
      policies: [],
      description: "Transcribe a session",
      tag: {
        plugin: "speechmatics",
        name: "Speechmatics",
        actionType: "update",
      },
    },
  },
];

export default routes;
