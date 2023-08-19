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
    path: "/startTraining",
    handler: "speechmatics.startTraining",
    config: {
      policies: [],
      description: "Starts training the AI",
      tag: {
        plugin: "speechmatics",
        name: "Speechmatics",
        actionType: "update",
      },
    },
  },
  {
    method: 'GET',
    path: '/trainingState',
    handler: 'speechmatics.trainingState',
    config: {
      policies: []
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
  {
    method: "POST",
    path: "/translateSession",
    handler: "speechmatics.translateSession",
    config: {
      policies: [],
      description: "Translates the moderated texts in a session",
      tag: {
        plugin: "speechmatics",
        name: "Speechmatics",
        actionType: "update",
      },
    },
  },
];

export default routes;
