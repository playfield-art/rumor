import { ILogType } from "@shared/interfaces";
import { Exception } from "../lib/exceptions/Exception";
import LoggerHelper from "../lib/logging/LoggerHelper";

/**
 * Get all log items
 * @param event The event
 * @param setting The setting formed as ISetting
 */
export const getAllLogRows = async () => {
  try {
    return await LoggerHelper.getAllLogRows();
  } catch (e: any) {
    throw new Exception({ where: "getAllLogRows", message: e.message });
  }
};

/**
 * Log a message
 * @param message The message
 * @param type The type of the message
 * @returns A Promise
 */
export const log = (
  event: Electron.IpcMainInvokeEvent,
  message: string,
  type: ILogType
) => {
  try {
    LoggerHelper.log(message, type);
  } catch (e: any) {
    throw new Exception({ where: "log", message: e.message });
  }
};

/**
 * Remove all logging
 * @param setting The setting formed as ISetting
 */
export const removeAllLogging = async () => {
  try {
    return await LoggerHelper.removeAllLogging();
  } catch (e: any) {
    throw new Exception({ where: "removeAllLogging", message: e.message });
  }
};
