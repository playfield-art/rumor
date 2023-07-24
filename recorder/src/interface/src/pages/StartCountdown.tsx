import React, { useEffect, useMemo, useState } from 'react'
import { useControl } from '../hooks/useControl'
import { Page } from './Layouts/Page';
import { ControlBoxFixed } from '../components/ControlBoxFixed';
import { useCountdown } from 'usehooks-ts';
import { useNavigate } from 'react-router-dom';
import { useTranslationsStore } from '../hooks/useTranslationsStore';
import { useSocket } from '../hooks/useSocket';
import { useScreen } from '../hooks/useScreen';

export const StartCountdown = () => {
  const [intervalValue] = useState<number>(1000)
  const [count, { startCountdown, stopCountdown }] =
    useCountdown({
      countStart: 15,
      intervalMs: intervalValue,
    })
  const navigate = useNavigate();
  const { sendToServer } = useSocket();
  const translations = useTranslationsStore((state) => state.translations);
  useScreen(true);

  /**
   * When the middle button is pressed, activate the language
   */
  const onMiddleButtonPressed = () => navigate('/set-language');

  // Use the control hook
  useControl({ onMiddleButtonPressed });

  // Start the countdown
  useEffect(() => {
    startCountdown();
    return () => stopCountdown();
  }, []);

  // Stop the countdown when the component is unmounted
  useEffect(() => {
    if(count <= 0) {
      sendToServer('startSession', {});
    }
  }, [count]);

  return (
    <Page>
      <div style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "40px",
        boxSizing: "border-box"
      }}>
        <h1>
          <p>
            {translations?.countdownPart1} <br />
            {translations?.countdownPart2} {count} {count == 1 ? translations?.second : translations?.seconds}.
          </p>
          <p>{translations?.countdownPart3}</p>
        </h1>
      </div>
      <ControlBoxFixed
        middleButtonType='back'
        enableLeft={false}
        enableRight={false}
      />
    </Page>
  )
}