import { useEffect, useState } from "react";

export const useMqtt = () => {
  const [currentMqttConnection, setCurrentMqttConnection] =
    useState<boolean>(false);

  useEffect(() => {
    window.rumor.methods.getMqttConnection().then((conn) => {
      setCurrentMqttConnection(conn);
    });

    const removeEventListenerOnMqttConnection =
      window.rumor.events.onMqttConnection((event, mqttConnection) => {
        console.log("mqttConnection", mqttConnection);
        setCurrentMqttConnection(mqttConnection);
      });
    return () => {
      removeEventListenerOnMqttConnection();
    };
  });

  return { currentMqttConnection };
};
