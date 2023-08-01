import { useEffect, useState } from "react";
import { socket } from "../socket";
import { SocketMessage } from "@shared/interfaces";

export const useSocket = () => {
  /**
   * Connect to the socket server
   */
  const connect = () => {
    // connect to socket
    socket.connect();

    // for debug purposes
    socket.onAny((m, payload) => { console.log(m, payload) });
  }

  /**
   * Disconnect from the socket server
   */
  const disconnect = () => {
    socket.disconnect();
  }

  /**
   * Send data to the socket server
   * @param payload
   */
  const sendToServer = (message: string, json: Object) => {
    const socketMessage: SocketMessage = { message, payload: JSON.stringify(json) };
    socket.send(socketMessage);
  }

  return {
    connect,
    disconnect,
    sendToServer
  }
};
