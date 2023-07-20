import { useEffect } from "react";
import { toast } from "react-toastify";
import { useRecorderStore } from "./useRecorderStore";
import { AudioPlayer } from "../lib/Player";
import { useAppStore } from "./useAppStore";

export const useApp = () => {
  const startPlaying = useRecorderStore((state) => state.startPlaying);
  const stopPlaying = useRecorderStore((state) => state.stopPlaying);
  const updateCurrentSC = useRecorderStore((state) => state.updateCurrentSC);
  const updateCurrentVO = useRecorderStore((state) => state.updateCurrentVO);
  const startProces = useAppStore((state) => state.startProces);
  const stopProces = useAppStore((state) => state.stopProces);

  useEffect(() => {
    /**
     * Whenever a long proces is running
     */
    const removeEventListenerOnProces = window.rumor.events.onProces(
      (cb, procesStatus) => {
        if (procesStatus.procesIsRunning)
          startProces(procesStatus?.message || "");
        else stopProces();
      }
    );

    /**
     * When we need to show a notification coming from the main process
     */
    const removeEventListenerOnNotifcation = window.rumor.events.onNotification(
      (cb, notification) => {
        toast(notification.message);
      }
    );

    /**
     * When the session starts
     */
    const removeEventListenerOnSessionStart =
      window.rumor.events.onSessionStarted(startPlaying);

    /**
     * When the session stops
     */
    const removeEventListenerOnSessionStopped =
      window.rumor.events.onSessionStopped(() => {
        AudioPlayer.cleanUp();
        stopPlaying();
      });

    /**
     * When the next VO is played
     */
    const removeEventListenerOnNextVO = window.rumor.events.onNextVO(
      (event, voiceOver) => {
        updateCurrentVO(voiceOver);
      }
    );

    /**
     * When a soundscape is played
     */
    const removeEventListenerOnPlaySoundscape =
      window.rumor.events.onPlaySoundscape((event, soundscape) => {
        updateCurrentSC(soundscape);
        AudioPlayer.play(soundscape.url);
      });

    /**
     * Cleanup
     */
    return () => {
      removeEventListenerOnProces();
      removeEventListenerOnNotifcation();
      removeEventListenerOnSessionStart();
      removeEventListenerOnSessionStopped();
      removeEventListenerOnNextVO();
      removeEventListenerOnPlaySoundscape();
    };
  }, []);
};
