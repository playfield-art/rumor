import { SOCKET_IO_PORT } from "./consts";
import { SocketSingleton } from "./lib/socket/SocketSingleton";
import { Socket } from "./lib/socket/Socket";

/**
 * Init socket io
 */
export const initSocketIo = () => {
  SocketSingleton.setInstance(new Socket(SOCKET_IO_PORT));
};
