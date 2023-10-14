import React, { useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../hooks/useSocket';
import { useScreen } from '../hooks/useScreen';
import { useControl } from '../hooks/useControl';

export const DuringPerformance = () => {
  const { sendToServer } = useSocket();
  useScreen(false)

  /**
  * When the middle button is pressed, activate the language
  */
  const onButtonPressed = () => {
    sendToServer('stopSession', {});
  };

  /**
   * Set the control behaviour
   */
  useControl({
    onLeftButtonPressed: onButtonPressed,
    onMiddleButtonPressed: onButtonPressed,
    onRightButtonPressed: onButtonPressed,
  })

  return (
    <div></div>
  )
}