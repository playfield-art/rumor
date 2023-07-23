import { useEffect, useState } from "react";
import { socket } from "../socket";

export const useSocket = () => {
  /**
   * Connect to the socket server
   */
  const connect = () => {
    socket.connect();
  }

  /**
   * Disconnect from the socket server
   */
  const disconnect = () => {
    socket.disconnect();
  }

  return {
    connect,
    disconnect
  }
};
