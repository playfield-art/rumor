import { Exception } from "../lib/exceptions/Exception";
import { MqttSingleton } from "../lib/mqtt/MqttSingleton";
import { Recorder } from "../recorder";

/**
 * Get boolean if we are connected to mqtt
 * @returns AudioList with VO and SC
 */
export const getMqttConnection = (): boolean => {
  try {
    return MqttSingleton.getInstance()._mqttClient.connected;
  } catch (e: any) {
    throw new Exception({ where: "getMqttConnection", message: e.message });
  }
};

/**
 * Reinit mqtt
 */
export const reInitMqtt = async () => {
  try {
    await Recorder.initMqtt();
  } catch (e: any) {
    throw new Exception({ where: "reInitMqtt", message: e.message });
  }
};
