import { Exception } from "../lib/exceptions/Exception";
import { MqttSingleton } from "../lib/mqtt/MqttSingleton";
import { SocketSingleton } from "../lib/socket/SocketSingleton";

/**
 * Change the page of the interface
 * @param event The event
 * @param page The page to change to
 */
export const changeInterfacePage = (
  event: Electron.IpcMainInvokeEvent,
  page: string
) => {
  try {
    SocketSingleton.getInstance().sendToClients("change-page", page);
  } catch (e: any) {
    throw new Exception({ where: "changePage", message: e.message });
  }
};

/**
 * Press a virtual button on the interface
 * @param event
 * @param page
 */
export const pressButtonInterface = (
  event: Electron.IpcMainInvokeEvent,
  button: number
) => {
  try {
    MqttSingleton.getInstance().publish("interface/button", {
      button,
    });
  } catch (e: any) {
    throw new Exception({ where: "changePage", message: e.message });
  }
};
