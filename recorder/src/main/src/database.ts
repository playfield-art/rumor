/**
 * A Database Instance
 */

import { join } from "path";
import { Sequelize } from "sequelize";
import { app } from "electron";
import { SEQUELIZE_LOGGING } from "./consts";

class Database {
  private sequelize: Sequelize;

  private databasePath: string;

  constructor(databasePath: string) {
    this.databasePath = databasePath;
    this.init();
  }

  init() {
    this.sequelize = new Sequelize({
      dialect: "sqlite",
      storage: this.databasePath,
      logging: SEQUELIZE_LOGGING,
    });
  }

  async testConnection() {
    try {
      await this.getSequelize().authenticate();
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  }

  getSequelize(): Sequelize {
    if (this.sequelize) return this.sequelize;
    this.init();
    return this.getSequelize();
  }
}

export default new Database(
  process.env.NODE_ENV === "development"
    ? "recorder.sqlite"
    : join(app.getPath("userData"), "recorder.sqlite")
);
