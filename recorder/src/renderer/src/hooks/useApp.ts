import { useEffect } from "react";
import store from "../store";

export const useApp = () => {
  useEffect(() => {
    const removeEventListenerOnProces = window.rumor.events.onProces(
      (cb, procesStatus) => {
        if (procesStatus.procesIsRunning) store.runProces(procesStatus.message);
        else store.stopProces();
      }
    );
    const removeEventListenerOnNotifcation = window.rumor.events.onNotification(
      (cb, notification) => {
        store.notify(notification.message);
      }
    );
    return () => {
      removeEventListenerOnProces();
      removeEventListenerOnNotifcation();
    };
  }, []);
};
