/**
 * LoggerHelper
 */

import { ILogRow } from "@shared/interfaces";
import LogItem from "../../models/LogItem";

export default class LoggerHelper {
  /**
   * Get all log items
   * @returns All log items
   */
  public static async getAllLogRows(): Promise<ILogRow[]> {
    const logItems = await LogItem.findAll();
    return logItems.map((logItem) => ({
      id: logItem.id,
      message: logItem.message,
      time: logItem.time,
      type: logItem.type,
    }));
  }
}
