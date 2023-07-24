import { SOCKET_IO_PORT } from "./consts";
import { SocketSingleton } from "./lib/socket/SocketSingleton";
import { Socket } from "./lib/socket/Socket";
import { SocketMessageHandler } from "./lib/socket/SocketMessageHandler";

/**
 * Init socket io
 */
export const initSocketIo = () => {
  const socket = new Socket(SOCKET_IO_PORT, (message) => {
    SocketMessageHandler.handleMessage(message);
  });
  SocketSingleton.setInstance(socket);
};
