/**
 * Logger class
 */

import { ILogType } from "@shared/interfaces";
import LogItem from "../../models/LogItem";

export default class Logger {
  public static async error(message: string): Promise<void> {
    await LogItem.create({
      time: new Date(),
      message,
      type: ILogType.ERROR,
    });
  }

  public static async info(message: string): Promise<void> {
    await LogItem.create({
      time: new Date(),
      message,
      type: ILogType.INFO,
    });
  }

  public static async success(message: string): Promise<void> {
    await LogItem.create({
      time: new Date(),
      message,
      type: ILogType.SUCCESS,
    });
  }

  public static async warn(message: string): Promise<void> {
    await LogItem.create({
      time: new Date(),
      message,
      type: ILogType.WARN,
    });
  }
}
