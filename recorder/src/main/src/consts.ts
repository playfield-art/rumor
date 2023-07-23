import { join } from "path";
import { app } from "electron";

// The path to our electron application
export const APP_PATH = app.getAppPath();

// The path to the source folder
export const MAIN_SOURCE_FOLDER = join(APP_PATH, "src", "main");

// A list of file we do not want listed in our AudioList
export const UNWANTED_FILES = [".DS_Store"];

// The public URL for our audiofiles
export const SEQUELIZE_LOGGING = false;

// The type of narrative parts/chapters
export const narrativeChapters = ["intro", "first", "second", "third", "outro"];

// MQTT topics to listen to
export const MQTT_TOPICS_SUBSCRIPTIONS = [
  "recorder",
  "light",
  "shellies/rumordoor",
  "interface",
];

// Where to send OSC to (QLC+)
export const QLC_HOST = "127.0.0.1";
export const QLC_PORT = 7700;

// Socket IO port
export const SOCKET_IO_PORT = 4444;
