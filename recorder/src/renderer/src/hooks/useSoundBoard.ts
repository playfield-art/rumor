import { useCallback } from "react";
import { useRecorderStore } from "./useRecorderStore";
import { useError } from "./useError";

const useSoundBoard = () => {
  const { showError } = useError();
  const isPlaying = useRecorderStore((state) => state.isPlaying);

  /**
   * Plays next VO
   */

  const playNextVO = useCallback(
    async () => window.rumor.methods.VOPlaylistDo("next"),
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
        showError(e);
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

  return {
    playNextVO,
    start,
    stop,
  };
};

export default useSoundBoard;
