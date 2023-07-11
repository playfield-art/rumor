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
