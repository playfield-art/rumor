import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { socket } from "../socket";
import { InformationBox } from '../components/InformationBox';
import { Page } from './Layouts/Page';
import { ControlBoxFixed } from '../components/ControlBoxFixed';
import { useNavigate } from 'react-router-dom';
import { useTranslationsStore } from '../hooks/useTranslationsStore';
import { interfaceTranslations } from '../translations';
import { useSocket } from '../hooks/useSocket';
import { useScreen } from '../hooks/useScreen';
import { ControlButton } from '../enums';

export const SetLanguage = () => {
  const navigate = useNavigate();
  const [instructions, setInstructions] = React.useState<string>(interfaceTranslations.en.pleaseSelectYourLanguage);
  const changeTranslations = useTranslationsStore((state) => state.changeTranslations);
  const { sendToServer } = useSocket();
  const [ selectedLanguageKeyIndex, setSelectedLanguageKeyIndex ] = useState(0);
  useScreen(true);

  // Get the keys of the translations
  const selectedLanguageKeys = useMemo(() => Object.keys(interfaceTranslations), []);

  /**
   * When the left button is pressed, we want to scroll to the previous item
   */
  const onLeftButtonPressed = () => {
    setSelectedLanguageKeyIndex((prev) => prev === 0 ? selectedLanguageKeys.length - 1 : prev - 1);
  }

  /**
   * When the middle button is pressed, activate the language
   */
  const onMiddleButtonPressed = useCallback(() => {
    // selected language
    const language = selectedLanguageKeys[selectedLanguageKeyIndex];

    // set the language in backend
    sendToServer('setLanguage', { language });

    // set the language in the frontend
    changeTranslations(language);

    // navigate to count down
    navigate('/start-countdown');
  }, [selectedLanguageKeyIndex]);

  /**
   * When the right button is pressed, we want to scroll to the next item
   */
  const onRightButtonPressed = () => {
    setSelectedLanguageKeyIndex((prev) => prev === selectedLanguageKeys.length - 1 ? 0 : prev + 1);
  }

  // Update the instructions when the language changes
  useEffect(() => {
    setInstructions(selectedLanguageKeys[selectedLanguageKeyIndex] ? interfaceTranslations[selectedLanguageKeys[selectedLanguageKeyIndex] as keyof typeof interfaceTranslations].pleaseSelectYourLanguage : '');
  }, [selectedLanguageKeyIndex]);

  // Use the control hook
  useEffect(() => {
    socket.once('button-pressed', (payload) => {
      const button = Number(payload.button) as ControlButton;
      switch(button) {
        case ControlButton.LEFT:
          if(onLeftButtonPressed) onLeftButtonPressed();
          break;
        case ControlButton.MIDDLE:
          if(onMiddleButtonPressed) onMiddleButtonPressed();
          break;
        case ControlButton.RIGHT:
          if(onRightButtonPressed) onRightButtonPressed();
          break;
        default:
          break;
      }
    })
  }, [selectedLanguageKeyIndex]);

  return (
    <Page>
      <InformationBox text={instructions} />
      <div style={{
        minWidth: 0,
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "4.5rem",
        color: "var(--white)",
        textAlign: "center"
      }}>
        {selectedLanguageKeys.length > 0 && selectedLanguageKeys[selectedLanguageKeyIndex] && (
          interfaceTranslations[selectedLanguageKeys[selectedLanguageKeyIndex] as keyof typeof interfaceTranslations].language
        )}
      </div>
      <ControlBoxFixed />
    </Page>
  )
}