import React from 'react'
import { useControl } from '../hooks/useControl'

export const SetLanguage = () => {
  const onLeftButtonPressed = () => {
    console.log('Pressed Left Button');
  }
  const onMiddleButtonPressed = () => {
    console.log('Pressed Middle Button');
  }
  const onRightButtonPressed = () => {
    console.log('Pressed Right Button');
  }
  useControl({ onLeftButtonPressed, onMiddleButtonPressed, onRightButtonPressed });
  return (
    <div>SelectLanguage</div>
  )
}