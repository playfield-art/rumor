import { useEffect, useState } from "react";
import { socket } from "../socket";
import { SocketMessage } from "@shared/interfaces";
import { useSocket } from "./useSocket";

export const useScreen = (on: boolean) => {
  const { sendToServer } = useSocket();

  useEffect(() => {
    sendToServer("screen", { state: on });
  }, []);

  return screen;
};
