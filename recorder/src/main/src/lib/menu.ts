import { app, Menu, BrowserWindow, MenuItemConstructorOptions } from "electron";

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
  selector?: string;
  submenu?: DarwinMenuItemConstructorOptions[] | Menu;
}

export default class MenuBuilder {
  private mainWindow: BrowserWindow;

  private isDevelopment: boolean;

  constructor(mainWindow: BrowserWindow, isDevelopment: boolean) {
    this.mainWindow = mainWindow;
    this.isDevelopment = isDevelopment;
  }

  /**
   * Building the Electron Application
   *
   * @returns
   */
  buildMenu(): Menu {
    if (this.isDevelopment || !this.isDevelopment) {
      this.setupDevelopmentEnvironment();
    }

    // get the template based on the OS
    const template =
      process.platform === "darwin"
        ? this.buildDarwinTemplate()
        : this.buildDefaultTemplate();

    // create the menu and set it as application menu
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  /**
   * Adds menu items based needed for development purposes
   */
  setupDevelopmentEnvironment(): void {
    this.mainWindow.webContents.on("context-menu", (_, props) => {
      const { x, y } = props;
      Menu.buildFromTemplate([
        {
          label: "Inspect element",
          click: () => {
            this.mainWindow.webContents.inspectElement(x, y);
          },
        },
      ]).popup({ window: this.mainWindow });
    });
  }

  /**
   * Builds the Darwin Template
   *
   * @returns The MenuItems needed for the template
   */
  buildDarwinTemplate(): MenuItemConstructorOptions[] {
    // The About Menu
    const subMenuAbout: DarwinMenuItemConstructorOptions = {
      label: "recorder",
      submenu: [
        {
          label: "Hide recorder",
          accelerator: "Command+H",
          selector: "hide:",
        },
        {
          label: "Hide Others",
          accelerator: "Command+Shift+H",
          selector: "hideOtherApplications:",
        },
        { label: "Show All", selector: "unhideAllApplications:" },
        { type: "separator" },
        {
          label: "Quit",
          accelerator: "Command+Q",
          click: () => {
            app.quit();
          },
        },
      ],
    };

    // The file menu
    const subMenuFile: DarwinMenuItemConstructorOptions = {
      label: "File",
      submenu: [],
    };

    // The Developer View Menu
    const subMenuViewDev: MenuItemConstructorOptions = {
      label: "View",
      submenu: [
        {
          label: "Reload",
          accelerator: "Command+R",
          click: () => {
            this.mainWindow.webContents.reload();
          },
        },
        {
          label: "Toggle Full Screen",
          accelerator: "Ctrl+Command+F",
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
        {
          label: "Toggle Developer Tools",
          accelerator: "Alt+Command+I",
          click: () => {
            this.mainWindow.webContents.toggleDevTools();
          },
        },
      ],
    };

    // The Production View Menu
    const subMenuViewProd: MenuItemConstructorOptions = {
      label: "View",
      submenu: [
        {
          label: "Toggle Full Screen",
          accelerator: "Ctrl+Command+F",
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
      ],
    };

    // The Window Menu
    const subMenuWindow: DarwinMenuItemConstructorOptions = {
      label: "Window",
      submenu: [
        {
          label: "Minimize",
          accelerator: "Command+M",
          selector: "performMiniaturize:",
        },
        { type: "separator" },
        { label: "Bring All to Front", selector: "arrangeInFront:" },
      ],
    };

    return [
      subMenuAbout,
      subMenuFile,
      this.isDevelopment ? subMenuViewDev : subMenuViewProd,
      subMenuWindow,
    ];
  }

  /**
   * Build The Default Template
   *
   * @returns
   */
  buildDefaultTemplate() {
    const templateDefault = [
      {
        label: "&File",
        submenu: [
          {
            label: "&Open",
            accelerator: "Ctrl+O",
          },
          {
            label: "&Close",
            accelerator: "Ctrl+W",
            click: () => {
              this.mainWindow.close();
            },
          },
        ],
      },
      {
        label: "&View",
        submenu: this.isDevelopment
          ? [
              {
                label: "&Reload",
                accelerator: "Ctrl+R",
                click: () => {
                  this.mainWindow.webContents.reload();
                },
              },
              {
                label: "Toggle &Full Screen",
                accelerator: "F11",
                click: () => {
                  this.mainWindow.setFullScreen(
                    !this.mainWindow.isFullScreen()
                  );
                },
              },
              {
                label: "Toggle &Developer Tools",
                accelerator: "Alt+Ctrl+I",
                click: () => {
                  this.mainWindow.webContents.toggleDevTools();
                },
              },
            ]
          : [
              {
                label: "Toggle &Full Screen",
                accelerator: "F11",
                click: () => {
                  this.mainWindow.setFullScreen(
                    !this.mainWindow.isFullScreen()
                  );
                },
              },
            ],
      },
    ];

    return templateDefault;
  }
}
