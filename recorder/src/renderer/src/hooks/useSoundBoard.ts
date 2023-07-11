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
  const startPlaying = useRecorderStore((state) => state.startPlaying);
  const stopPlaying = useRecorderStore((state) => state.stopPlaying);

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
        // set the internal "started" state
        startPlaying();

        // create a new session
        const audioList = await window.rumor.methods.createNewSession();

        // init the VOPlaylist in backend
        window.rumor.methods.initPlaylist(audioList);

        // play the first audio file
        window.rumor.methods.VOPlaylistDo("next");
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
      window.rumor.methods.VOPlaylistDo("stop");

      // stop the recording (even if it is not recording, just to be sure)
      await window.rumor.actions.stopRecording();

      // clean up th audioplayer
      AudioPlayer.cleanUp();

      // stop play (in frontend)
      stopPlaying();
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
