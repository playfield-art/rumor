/**
 * The serial button singleton
 */

import { Serial } from "./Serial";

export interface SerialButtonParams {
  path: string;
  onButtonUp?: () => void;
  onButtonDown?: () => void;
}

export class SerialButton {
  _serial: Serial;

  _onButtonUp: () => void;

  _onButtonDown: () => void;

  constructor({
    path,
    onButtonUp = () => {},
    onButtonDown = () => {},
  }: SerialButtonParams) {
    this._onButtonDown = onButtonDown;
    this._onButtonUp = onButtonUp;
    this._serial = new Serial({
      path,
      autoOpen: true,
      baudRate: 9600,
      onDataReceived: this.onDataReceived.bind(this),
    });
  }

  async changePath(path: string) {
    if (this._serial) await this._serial.changePath(path);
  }

  async closeConnection() {
    if (this._serial) await this._serial.close();
  }

  onDataReceived(data: any) {
    const stringData: string = String(data);
    if (stringData.startsWith("BUTTON")) {
      const command = stringData.split(" ")[1].trim();
      switch (command) {
        case "UP":
          if (this._onButtonUp) this._onButtonUp();
          break;
        case "DOWN":
          if (this._onButtonDown) this._onButtonDown();
          break;
        default:
      }
    }
  }
}
