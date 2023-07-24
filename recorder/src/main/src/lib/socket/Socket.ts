import { Server } from "socket.io";

export class Socket {
  private port: number;

  private development: boolean;

  public socketServer: Server;

  constructor(port: number, development: boolean = true) {
    this.port = port;
    this.development = development;
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
