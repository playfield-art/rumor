import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useControl } from '../hooks/useControl';

export const DuringPerformance = () => {
  const navigate = useNavigate();

   /**
   * When the middle button is pressed, activate the language
   */
  const onMiddleButtonPressed = () => {
    // @todo: stop the session

    // navigate to the language screen
    navigate('/set-language')
  };

  // Use the control hook
  useControl({ onMiddleButtonPressed });

  return (
    <div></div>
  )
}