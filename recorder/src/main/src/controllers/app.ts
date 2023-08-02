import { app } from "electron";

/**
 * Get the application version
 * @returns The application version
 */
export const getAppVersion = () => app.getVersion();
