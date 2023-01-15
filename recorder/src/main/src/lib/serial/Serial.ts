/**
 * A Library To interact with a serialport (Arduino)
 */

import { SerialPort } from "serialport";
import { ReadlineParser } from '@serialport/parser-readline';

export const getSerialPorts = async (): Promise<string[]> => {
  const serialPorts = await SerialPort.list();
  return serialPorts.map((port) => String(port.path));
}

export interface SerialParams {
  path: string,
  autoOpen: boolean,
  baudRate: number,
  onDataReceived: (data: any) => void;
}

export class Serial {
  _path: string;
  _port: SerialPort;
  _autoOpen: boolean;
  _baudRate: number;
  _parser: any;
  _onDataReceived: (data: any) => void;

  constructor({
    path,
    autoOpen = true,
    baudRate = 9600,
    onDataReceived = () => {}
  }: SerialParams) {
    this._path = path;
    this._autoOpen = autoOpen;
    this._baudRate = baudRate;
    this._port = new SerialPort({
      path,
      baudRate,
      autoOpen
    });
    this._parser = this._port.pipe(new ReadlineParser({ delimiter: '\n' }));
    if(onDataReceived) {
      this._onDataReceived = onDataReceived;
      this._parser.on('data', this._onDataReceived);
    }
  }

  async changePath(path: string) {
    if (this._port.isOpen) await this.close();
    this._path = path;
    this._port = new SerialPort({
      path: this._path,
      baudRate: this._baudRate,
      autoOpen: this._autoOpen
    });
    this._parser = this._port.pipe(new ReadlineParser({ delimiter: '\n' }));
    if(this._onDataReceived) this._parser.on('data', this._onDataReceived);
  }

  close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._port.on("close", (err:any) => {
        if(err) reject(err);
        this.delay(2000).then(() => resolve()); // a safe delay, after opening so everything is steady
      });
      this._port.close();
    });
  }

  delay(ms: number): Promise<void> {
    return new Promise(res => {
      setTimeout(res, ms);
    });
  }

  open(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._port.on("open", (err) => {
        if(err) reject(err);
        this.delay(2000).then(() => resolve()); // a safe delay, after opening so everything is steady
      });
      this._port.open();
    });
  };

  write(data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this._port.write(data, (err) => {
        if(err) reject();
        resolve();
      });
    })
  }
}