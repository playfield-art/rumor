import { MQTT_TOPICS_SUBSCRIPTIONS } from "./consts";
import { MQTT } from "./lib/mqtt/Mqtt";
import { MqttSingleton } from "./lib/mqtt/MqttSingleton";
import { MqttTopicHandler } from "./lib/mqtt/MqttTopicHandler";
import SettingHelper from "./lib/settings/SettingHelper";
import { Recorder } from "./recorder";

/**
 * Init the MQTT
 */
export const initMQTT = async () => {
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
      await MqttTopicHandler.handleTopic(topic, payload);
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
    ("mqtt-connection", false);
  }
};
