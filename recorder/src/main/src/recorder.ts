import { ProcesStatus, Notifciation } from "@shared/interfaces";
import { BrowserWindow } from "electron";
import { AudioRecording } from "./lib/audio/AudioRecording";
import { AudioRecordingSingleton } from "./lib/audio/AudioRecordingSingleton";
import { getSerialPorts } from "./lib/serial/Serial";
import { SerialButton } from "./lib/serial/SerialButton";
import { SerialButtonSingleton } from "./lib/serial/SerialButtonSingleton";
import SettingHelper from "./lib/settings/SettingHelper";
import { MQTT } from "./lib/mqtt/Mqtt";
import { MqttSingleton } from "./lib/mqtt/MqttSingleton";
import { MqttTopicHandler } from "./lib/mqtt/MqttTopicHandler";
import { MQTT_TOPICS_SUBSCRIPTIONS } from "./consts";

/**
 * The app class
 */
export class Recorder {
  private static _mainWindow: BrowserWindow;

  /**
   * Getters & Setters
   */

  public static get mainWindow() {
    return Recorder._mainWindow;
  }

  public static set mainWindow(mainWindow: BrowserWindow) {
    Recorder._mainWindow = mainWindow;
  }

  /**
   * Logic
   */

  public static async initApplication() {
    /**
     * Audio Recording
     */

    const recordingsFolderSetting = await SettingHelper.getSetting(
      "recordingsFolder"
    );
    if (recordingsFolderSetting?.value)
      AudioRecordingSingleton.setInstance(
        new AudioRecording({
          outDir: recordingsFolderSetting.value,
        })
      );

    /**
     * Serial Button
     */

    const serialPorts = await getSerialPorts();
    const usbSerialPort = serialPorts.find((port) =>
      port.includes("usbserial")
    );
    if (usbSerialPort) {
      SerialButtonSingleton.setInstance(
        new SerialButton({
          path: usbSerialPort,
          onButtonUp: () => Recorder._mainWindow.webContents.send("next-vo"),
        })
      );
    }

    /**
     * MQTT
     */

    await Recorder.initMqtt();
  }

  /**
   * Init MQTT
   */
  public static async initMqtt() {
    // get the mqtt host and port
    const mqttHost = await SettingHelper.getSettingValue("mqttHost", "");
    const mqttPort = await SettingHelper.getSettingValue("mqttPort", "");
    if (!mqttHost || !mqttPort) return;

    // disconnect the mqtt client if it is connected
    if (
      MqttSingleton.getInstance() &&
      MqttSingleton.getInstance()._mqttClient?.connected
    ) {
      MqttSingleton.getInstance().disconnectMqttClient();
      MqttSingleton.getInstance().destroy();
    }

    // create the mqtt instance
    const mqtt = new MQTT(`${mqttHost}:${mqttPort}`, {
      onConnect: () => {
        Recorder.mainWindow.webContents.send("mqtt-connection", true);
      },
      onMessage: async (topic, payload) => {
        await MqttTopicHandler.handleTopic(topic, payload, (m, p) => {
          Recorder.mainWindow.webContents.send(m, p);
        });
      },
      onOffline: () => {
        Recorder.mainWindow.webContents.send("mqtt-connection", false);
      },
    });

    // set the instance
    MqttSingleton.setInstance(mqtt);

    try {
      await MqttSingleton.getInstance().connectToMqttClient();
      MQTT_TOPICS_SUBSCRIPTIONS.forEach((topic) => {
        mqtt.subscribe(`${topic}/+`);
      });
    } catch (error) {
      Recorder.mainWindow.webContents.send("mqtt-connection", false);
    }
  }

  public static changeProces(procesStatus: ProcesStatus) {
    Recorder._mainWindow.webContents.send("on-proces", procesStatus);
  }

  public static notifcation(notifcation: Notifciation) {
    Recorder._mainWindow.webContents.send("on-notification", notifcation);
  }
}
