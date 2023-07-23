import { useEffect, useState } from "react";
import { socket } from "../socket";
import { ControlButton } from "../enums";

interface useControlProps {
  onButtonPressed?: (button: ControlButton) => void
  onLeftButtonPressed?: () => void
  onMiddleButtonPressed?: () => void
  onRightButtonPressed?: () => void
}

export const useControl = ({
  onButtonPressed,
  onLeftButtonPressed,
  onRightButtonPressed,
  onMiddleButtonPressed
}: useControlProps) => {
  useEffect(() => {
    socket.on('button-pressed', (payload) => {
      const button = Number(payload.button) as ControlButton;
      if(onButtonPressed) onButtonPressed(button);
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
    return () => {
      socket.off('button-pressed');
    }
  });
};
