/**
 * LoggerHelper
 */

import { ILogRow, ILogType } from "@shared/interfaces";
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

  /**
   * Remove all log items
   */
  public static async removeAllLogging(): Promise<void> {
    await LogItem.destroy({ where: {} });
  }

  /**
   * Log a message
   * @param message The message
   * @param type The type of the message
   */
  public static async log(message: string, type: ILogType): Promise<void> {
    await LogItem.create({
      time: new Date(),
      message,
      type,
    });
  }
}
