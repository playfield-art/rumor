import { Exception } from "../lib/exceptions/Exception";
import { MqttSingleton } from "../lib/mqtt/MqttSingleton";
import { initMQTT } from "../mqtt";

/**
 * Get boolean if we are connected to mqtt
 * @returns AudioList with VO and SC
 */
export const getMqttConnection = (): boolean => {
  try {
    return MqttSingleton.getInstance()._mqttClient?.connected ?? false;
  } catch (e: any) {
    throw new Exception({ where: "getMqttConnection", message: e.message });
  }
};

/**
 * Reinit mqtt
 */
export const reInitMqtt = async () => {
  try {
    await initMQTT();
  } catch (e: any) {
    throw new Exception({ where: "reInitMqtt", message: e.message });
  }
};
