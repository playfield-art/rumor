/**
 * Logger class
 */

import { ILogType } from "@shared/interfaces";
import LogItem from "../../models/LogItem";

export default class Logger {
  public static error(message: string): void {
    LogItem.create({
      time: new Date(),
      message,
      type: ILogType.ERROR,
    });
  }

  public static info(message: string): void {
    LogItem.create({
      time: new Date(),
      message,
      type: ILogType.INFO,
    });
  }

  public static success(message: string): void {
    LogItem.create({
      time: new Date(),
      message,
      type: ILogType.SUCCESS,
    });
  }

  public static warn(message: string): void {
    LogItem.create({
      time: new Date(),
      message,
      type: ILogType.WARN,
    });
  }
}
