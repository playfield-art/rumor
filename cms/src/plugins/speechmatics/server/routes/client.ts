import { StrapiRoute } from "strapi-typed";

const routes: StrapiRoute[] = [
  {
    method: "GET",
    path: "/hello",
    handler: "speechmatics.hello",
    config: {
      policies: [],
      description: "Hello world!",
      tag: {
        plugin: "speechmatics",
        name: "Speechmatics",
        actionType: "find",
      },
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
    path: "/notify",
    handler: "speechmatics.notify",
    config: {
      policies: [],
      description: "Notify whenever a transription is ready",
      tag: {
        plugin: "speechmatics",
        name: "Speechmatics",
        actionType: "update",
      },
    },
  }
];

export default routes;
