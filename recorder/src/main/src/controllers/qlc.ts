import { QLCFunction } from "@shared/enums";
import { Exception } from "../lib/exceptions/Exception";
import { QLCSingleton } from "../lib/qlc/QLCSingleton";
import { openQLC as openQLCFunction } from "../lib/qlc/QLCHelpers";

/**
 * Set the color of a channel
 */
export const setColor = (
  event: Electron.IpcMainInvokeEvent,
  color: "red" | "blue" | "green" | "white",
  value: number
) => {
  try {
    const colorToChannelMap = {
      red: 1,
      green: 2,
      blue: 3,
      white: 4,
    };
    QLCSingleton.getInstance().setChannel(colorToChannelMap[color], value);
  } catch (e: any) {
    throw new Exception({ where: "setColor", message: e.message });
  }
};

/**
 * Trigger a function in QLC
 */
export const triggerFunction = (
  event: Electron.IpcMainInvokeEvent,
  qlcFunction: QLCFunction
) => {
  try {
    QLCSingleton.getInstance().triggerFunction(qlcFunction);
  } catch (e: any) {
    throw new Exception({ where: "triggerFunction", message: e.message });
  }
};

/**
 * Opens the QLC+ application
 * @param event
 */
export const openQLC = () => {
  try {
    openQLCFunction();
  } catch (e: any) {
    throw new Exception({ where: "openQLC", message: e.message });
  }
};
