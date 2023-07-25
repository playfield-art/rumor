/**
 * Creates an MQTT class
 */
import { IError } from "@shared/interfaces";
import * as mqtt from "mqtt";

export class MQTT {
  private _brokerUrl: string;

  private _host: string;

  private _port: string;

  public _mqttClient: mqtt.MqttClient | null;

  private _onMessage: ((topic: string, payload: any) => void) | undefined;

  private _onError: ((error: IError) => void) | undefined;

  private _onConnect: () => void | undefined;

  private _onOffline: (() => void) | undefined;

  constructor(
    brokerUrl: string,
    options: {
      onMessage?: (topic: string, payload: any) => void;
      onError?: (error: IError) => void;
      onOffline?: () => void;
      onConnect: () => void;
    }
  ) {
    this._brokerUrl = brokerUrl;
    this._onMessage = options.onMessage;
    this._onError = options.onError;
    this._onConnect = options.onConnect;
    this._onOffline = options.onOffline;
    this.init();
  }

  /**
   * Gets the current broken url
   */
  public get brokerUrl() {
    return this._brokerUrl;
  }

  /**
   * Connect to an MQTT client
   * @returns
   */
  public async connectToMqttClient() {
    // create the MQTT client promise and wait until connected
    const connectSync = new Promise<mqtt.MqttClient>((resolve, reject) => {
      // try connecting to MQTT
      this._mqttClient = mqtt.connect(this._brokerUrl, {
        reconnectPeriod: 2000,
        keepalive: 1,
        connectTimeout: 2000,
        host: this._host,
        port: Number(this._port),
        clientId: `recorder-${Math.random().toString(16).substring(2, 8)}`,
      });

      // whenever we encounter an error, close the connection
      this._mqttClient.on("error", (error) => {
        const errorMessage = error.message.includes("ECONNREFUSED")
          ? "Cannot connect to MQTT broker."
          : error.message;
        if (this._onError)
          this._onError({
            message: errorMessage,
            where: "connectToMqttClient",
          });
        this._mqttClient?.end();
        reject(errorMessage);
      });

      // whenever we are connected,
      this._mqttClient.on("connect", () => {
        // let them now
        if (this._onConnect) this._onConnect();

        // whenever we receive a message
        this._mqttClient?.on("message", (topic, message) => {
          if (this._onMessage) this._onMessage(topic, message);
        });

        // resolve the promise
        if (this._mqttClient) resolve(this._mqttClient);
      });

      // whenever we are disconnected
      this._mqttClient.on("end", () => {
        setTimeout(() => {
          this._mqttClient?.reconnect();
        }, 2000);
      });

      // whenever we are offline
      this._mqttClient.on("offline", () => {
        // let them now
        if (this._onOffline) this._onOffline();
      });
    });

    // return the promise
    return connectSync;
  }

  /**
   * Destroy the MQTT client
   */
  public destroy() {
    this._mqttClient?.removeAllListeners();
    this._mqttClient = null;
  }

  /**
   * Disconnect from current MQTT client
   */
  public disconnectMqttClient() {
    if (this._mqttClient && this._mqttClient.connected) {
      this._mqttClient.end(true);
    }
  }

  /**
   * Initialize the MQTT connection
   */
  private init() {
    let url = this._brokerUrl;
    if (url.startsWith("mqtt://")) {
      url = url.slice("mqtt://".length);
    }
    const [host, port] = url.split(":");
    this._host = host;
    this._port = port;
  }

  /**
   * Publish something to MQTT
   * @param topic The topic
   * @param json The JSON to publish
   * @returns
   */
  public async publish(topic: string, json?: any): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this._mqttClient || !this._mqttClient.connected) resolve();
      this._mqttClient?.publish(topic, JSON.stringify(json || {}), () =>
        resolve()
      );
      reject();
    });
  }

  /**
   * Subscribe to a topic
   * @param topic The topic to subscribe
   * @param callback Callback whenever we receive a message
   * @returns
   */
  public async subscribe(topic: string) {
    // validate
    if (!this._mqttClient || !this._mqttClient.connected) return;

    // subscribe to topic
    this._mqttClient.subscribe(topic);
  }

  /**
   * Unsubscribe topic
   * @param topic
   * @returns
   */
  public async unsubscribe(topic: string) {
    // validate
    if (!this._mqttClient || !this._mqttClient.connected) return;

    // unsubscribe topic
    await this._mqttClient.unsubscribe(topic);
  }
}
