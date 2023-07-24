import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useControl } from '../hooks/useControl';
import { useSocket } from '../hooks/useSocket';

export const DuringPerformance = () => {
  const { sendToServer } = useSocket();

  /**
  * When the middle button is pressed, activate the language
  */
  const onButtonPressed = () => {
    sendToServer('stopSession', {});
  };

  // Use the control hook
  useControl({
    onMiddleButtonPressed: onButtonPressed,
    onLeftButtonPressed: onButtonPressed,
    onRightButtonPressed: onButtonPressed
  });

  return (
    <div></div>
  )
}