import { useState, useEffect, useCallback } from "react";
import { CAN_CONTINUE_WHILE_PLAYING, CAN_RECORD, FADING_TIME } from "../consts";
import { OnPlayChange, OnVOEnd, SoundBoard } from "../lib/SoundBoard";
import { IError } from "@shared/interfaces";

const useSoundBoard = (onError?: (e: Error) => void) => {
  const [currentVO, setCurrentVO] = useState('');
  const [currentSC, setCurrentSC] = useState('');

  /**
   * When a VO or SC changed
   */

  const onPlayChange = useCallback((e: OnPlayChange) => {
    setCurrentVO(e.VO ? e.VO.name : "");
    setCurrentSC(e.SC ? e.SC.name : "");
    if(CAN_RECORD) window.rumor.actions.stopRecording();
  }, []);

  /**
   * When a VO ends
   */

  const onVOEnd = useCallback((e: OnVOEnd) => {
    if(CAN_RECORD && !e.isLast) window.rumor.actions.startRecording(`ANSW-VO_${e.VO?.id}.wav`);
  }, []);

  /**
   * Create a new soundboard
   */

  const soundBoard = new SoundBoard({
    onPlayChange,
    onVOEnd,
    onStart: async () => {
      try {
        await window.rumor.methods.createNewRecordingFolder()
      } catch(e: any) {
        if(onError) onError(e);
      }
    },
    fadingTime: FADING_TIME,
    canContinueWhilePlaying: CAN_CONTINUE_WHILE_PLAYING
  });

  /**
   * Whenever the soundboard loads/changes
   */
  useEffect(() => {
    const initSoundBoard  = async() => await soundBoard.init();
    initSoundBoard();
  }, [soundBoard])

  /**
   * Whenever the component got hooked
   */
  useEffect(() => {
    const removeAllListeners = window.rumor.events.onNextVO(() => soundBoard.playNextVO());
    return () => removeAllListeners();
  }, []);

  /**
   * Plays next VO
   */

  const playNextVO = useCallback(() => soundBoard.playNextVO(), []);

  /**
   * Stops the soundboard
   */

  const stop = useCallback(() => {
    soundBoard.stop();
    soundBoard.reset();
  }, []);

  /**
   * Refetches the data from main (filesystem)
   */

  const refetch = useCallback(() => soundBoard.refetch(), []);

  return {
    playNextVO,
    stop,
    refetch,
    currentVO,
    currentSC
  };
};

export default useSoundBoard;
