import { Client } from "node-osc";
import { QLCFunction } from "@shared/enums";

export class QLC {
  private localAddress: string;

  private localPort: number;

  private oscClient: Client;

  constructor(localAddress: string, localPort: number) {
    this.localAddress = localAddress;
    this.localPort = localPort;
    this.oscClient = new Client(this.localAddress, this.localPort);
  }

  /**
   * Send a message to QLC
   * @param message The OSC message to send
   * @param value The value to set the channel to (0-255)
   */
  public send(message: string, value: number) {
    // @ts-ignore
    this.oscClient.send(message, value);
  }

  /**
   * Update a channel
   * @param channel The corresponding channel number
   * @param value The value to set the channel to (0-255)
   */
  public setChannel(channel: number, value: number) {
    const message = `/channel/${channel}/value`;
    this.send(message, value);
  }

  /**
   * Trigger a function in QLC
   * @param qlcFunction The function to trigger
   */
  public triggerFunction(qlcFunction: QLCFunction) {
    const message = `/function/${qlcFunction}`;
    this.send(message, 1);
  }
}
