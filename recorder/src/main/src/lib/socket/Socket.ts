import { SocketMessage } from "@shared/interfaces";
import { Server } from "socket.io";

export class Socket {
  private port: number;

  public socketServer: Server;

  private _onMessage: ((message: SocketMessage) => void) | undefined;

  constructor(port: number, onMessage?: (message: SocketMessage) => void) {
    this.port = port;
    this._onMessage = onMessage;
    this.initServer();
  }

  /**
   * Init the server
   */
  private initServer() {
    this.socketServer = new Server({
      cors: {
        origin: `*`,
      },
    });

    this.socketServer.attach(this.port);
    this.socketServer.on("connection", (socket) => {
      socket.on("message", (data: any) => {
        if (this._onMessage) this._onMessage(data as SocketMessage);
      });
    });
  }

  /**
   * Send data to the clients
   * @param event The event to send
   * @param data The data to send
   */
  public sendToClients(event: string, data: any) {
    this.socketServer.emit(event, data);
  }
}
