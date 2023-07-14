import { VoiceOver, SoundScape } from "@shared/interfaces";
import { useState, useCallback, useEffect } from "react";
// import { CAN_CONTINUE_WHILE_PLAYING, CAN_RECORD, FADING_TIME } from "../consts";
// import { OnPlayChange, OnVOEnd, SoundBoard } from "../lib/SoundBoard";
import { useRecorderStore } from "./useRecorderStore";
import { AudioPlayer } from "../lib/Player";

const useSoundBoard = (onError?: (e: Error) => void) => {
  const [currentVO] = useState<VoiceOver | null>(null);
  const [currentSC] = useState<SoundScape | null>(null);
  const isPlaying = useRecorderStore((state) => state.isPlaying);

  /**
   * Plays next VO
   */

  const playNextVO = useCallback(
    () => window.rumor.methods.VOPlaylistDo("next"),
    []
  );

  /**
   * Start the soundboard
   */

  const start = useCallback(async () => {
    if (!isPlaying) {
      try {
        await window.rumor.methods.startSession();
      } catch (e: any) {
        if (onError) onError(e);
      }
    }
  }, [isPlaying]);

  /**
   * Stops the soundboard
   */

  const stop = useCallback(async () => {
    if (isPlaying) {
      // stop the voice overs
      window.rumor.methods.stopSession();
    }
  }, [isPlaying]);

  /**
   * Whenever
   */

  useEffect(() => {
    const removeEventListenerOnPlaySoundscape =
      window.rumor.events.onPlaySoundscape((event, soundscape) => {
        if (isPlaying) {
          AudioPlayer.play(soundscape.url);
        }
      });
    return () => {
      removeEventListenerOnPlaySoundscape();
    };
  }, [isPlaying]);

  return {
    playNextVO,
    start,
    stop,
    isPlaying,
    currentVO,
    currentSC,
  };
};

export default useSoundBoard;
