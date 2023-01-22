import { join } from "path";
import { app } from 'electron';

// The path to our electron application
export const APP_PATH = app.getAppPath();

// The path to the source folder
export const MAIN_SOURCE_FOLDER = join(APP_PATH, 'src', 'main');

// A list of file we do not want listed in our AudioList
export const UNWANTED_FILES = ['.DS_Store']

// The public URL for our audiofiles
export const SEQUELIZE_LOGGING = false;

// The type of narrative parts/chapters
export const narrativeChapters = [ "intro", "first", "second", "third", "outro" ];