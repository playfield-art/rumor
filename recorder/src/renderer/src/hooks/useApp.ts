import { useEffect } from "react";
import store from "../store";
import { useRecorderStore } from "./useRecorderStore";
import { AudioPlayer } from "../lib/Player";

export const useApp = () => {
  const startPlaying = useRecorderStore((state) => state.startPlaying);
  const stopPlaying = useRecorderStore((state) => state.stopPlaying);

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
    const removeEventListenerOnSessionStart =
      window.rumor.events.onSessionStarted(startPlaying);

    const removeEventListenerOnSessionStopped =
      window.rumor.events.onSessionStopped(() => {
        AudioPlayer.cleanUp();
        stopPlaying();
      });

    return () => {
      removeEventListenerOnProces();
      removeEventListenerOnNotifcation();
      removeEventListenerOnSessionStart();
      removeEventListenerOnSessionStopped();
    };
  }, []);
};
