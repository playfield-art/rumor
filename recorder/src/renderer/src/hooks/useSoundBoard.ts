import { VoiceOver, VoiceOverType, SoundScape } from "@shared/interfaces";
import { useState, useEffect, useCallback, useMemo } from "react";
import { CAN_CONTINUE_WHILE_PLAYING, CAN_RECORD, FADING_TIME } from "../consts";
import { OnPlayChange, OnVOEnd, SoundBoard } from "../lib/SoundBoard";

const useSoundBoard = (onError?: (e: Error) => void) => {
  const [currentVO, setCurrentVO] = useState<VoiceOver>();
  const [currentSC, setCurrentSC] = useState<SoundScape>();
  const [started, setStarted] = useState(false);

  /**
   * When a VO or SC changed
   */

  const onPlayChange = useCallback((e: OnPlayChange) => {
    setCurrentVO(e.VO);
    setCurrentSC(e.SC);
    if(CAN_RECORD) window.rumor.actions.stopRecording();
  }, []);

  /**
   * When a VO ends
   */

  const onVOEnd = useCallback((e: OnVOEnd) => {
    if(CAN_RECORD && !e.isLast && e.VO?.type === VoiceOverType.Question) {
      window.rumor.actions.startRecording(e.VO.language, e.VO.id);
    }
    if(e.VO?.type === VoiceOverType.VoiceOver) soundBoard.playNextVO();
  }, []);

  /**
   * Create a new soundboard
   */

  const soundBoard = useMemo(
    () => new SoundBoard({
      onPlayChange,
      onVOEnd,
      onStop: () => {
        setStarted(false);
      },
      onStart: async () => {
        try {
          await window.rumor.methods.createNewRecordingFolder()
          setStarted(true);
        } catch(e: any) {
          if(onError) onError(e);
        }
      },
      fadingTime: FADING_TIME,
      canContinueWhilePlaying: CAN_CONTINUE_WHILE_PLAYING
    }
  ), []);

  /**
   * Whenever the component got hooked
   */
  useEffect(() => {
    const removeAllListeners = window.rumor.events.onNextVO(async () => {
      if(!started) { await soundBoard.init(); }
      soundBoard.playNextVO()
    });
    return () => removeAllListeners();
  }, []);

  /**
   * Plays next VO
   */

  const playNextVO = useCallback(() => soundBoard.playNextVO(), []);

  /**
   * Start the soundboard
   */

  const start = useCallback(async() => {
    if(!started) {
      await soundBoard.init();
      soundBoard.playNextVO()
    }
  }, [started]);

  /**
   * Stops the soundboard
   */

  const stop = useCallback(() => {
    if(started) {
      soundBoard.stop();
      soundBoard.reset();
    }
  }, [started]);

  return {
    playNextVO,
    start,
    stop,
    started,
    currentVO,
    currentSC
  };
};

export default useSoundBoard;
