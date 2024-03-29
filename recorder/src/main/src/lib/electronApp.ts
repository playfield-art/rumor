/**
 * The Main Electron App class
 */

import path from "path";
import { URL } from "url";
import { BrowserWindow } from "electron";

import MenuBuilder from "./menu";

interface ElectronAppOptions {
  browserWidth?: number;
  browserHeight?: number;
  iconPath?: string;
  installExtensions?: boolean;
}

export default class ElectronApp {
  public isDevelopment: boolean;

  public isProduction: boolean;

  private port: string | number | undefined;

  private options: ElectronAppOptions;

  constructor(
    options: ElectronAppOptions = {
      browserWidth: 550,
      browserHeight: 450,
      iconPath: "",
      installExtensions: false,
    }
  ) {
    this.options = options;
    this.isDevelopment = import.meta.env.MODE === "development";
    this.isProduction = import.meta.env.MODE === "production";
    this.port = process.env.VITE_DEV_SERVER_PORT || 3000;
  }

  /**
   * Resolve the HTML path, based on staging
   *
   * @param htmlFileName
   * @returns
   */
  resolveHtmlPath(htmlFileName: string): string {
    if (this.isDevelopment) {
      const url = new URL(`http://localhost:${this.port}`);
      url.pathname = htmlFileName;
      return url.href;
    }
    return new URL(
      "../renderer/dist/index.html",
      `file://${__dirname}`
    ).toString();
  }

  /**
   * Creates a new Electron window
   *
   * @returns a BrowserWindow
   */
  async createWindow(): Promise<BrowserWindow | null> {
    return new Promise<BrowserWindow | null>((resolve) => {
      // create an internal variable to work with
      let browserWindow: BrowserWindow | null = null;

      // create a new main window
      browserWindow = new BrowserWindow({
        show: false,
        width: this.options.browserWidth,
        height: this.options.browserHeight,
        icon: this.options?.iconPath ? this.options.iconPath : "",
        webPreferences: {
          webSecurity: false,
          webviewTag: false,
          preload: path.join(__dirname, "../../preload/dist/index.cjs"),
        },
        alwaysOnTop: this.isProduction,
      });

      // load the index html page
      browserWindow.loadURL(this.resolveHtmlPath("index.html"));

      // when we are ready to go
      browserWindow.on("ready-to-show", () => {
        if (!browserWindow) {
          throw new Error('"mainWindow" is not defined');
        }
        // browserWindow.show();
        resolve(browserWindow);
      });

      // when the render process is gone, reload the page
      browserWindow.webContents.on("render-process-gone", (event, detailed) => {
        if (detailed.reason === "crashed") {
          browserWindow?.webContents.reload();
        }
      });

      // when we are closing, destroy the main window
      browserWindow.on("closed", () => {
        browserWindow = null;
      });

      // creates the menu
      const menuBuilder = new MenuBuilder(browserWindow, this.isDevelopment);
      menuBuilder.buildMenu();
    });
  }
}
