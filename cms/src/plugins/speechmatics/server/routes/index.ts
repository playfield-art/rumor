import { StrapiRoute } from "strapi-typed";
import adminRoutes from "./admin";
import clientRoutes from './client';

type PluginRoutes = {
  [key: string]: PluginScopeRoutes;
};

type PluginScopeRoutes = {
  type: string;
  routes: Array<StrapiRoute>;
};

const routes: PluginRoutes = {
  "content-api": {
    type: "content-api",
    routes: clientRoutes,
  },
  admin: {
    type: "admin",
    routes: adminRoutes,
  },
};

export default routes;
