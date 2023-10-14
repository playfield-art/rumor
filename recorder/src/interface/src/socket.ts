import { io } from 'socket.io-client';
import { SocketData } from './interfaces';

const socketData = JSON.parse(localStorage.getItem('socketData') || "{}") as SocketData;
export const socket = io(
  socketData.socketUrl || 'http://localhost:4444', {
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000
  }
);