import { useEffect, useContext, DependencyList } from "react";
import { ControlButtonActions } from "../interfaces";
import ControlButtonContext from "../ControlButtonContext";

export const useControl = (controlButtonActions: ControlButtonActions, deps?: DependencyList) => {
  const controlButtonContext = useContext(ControlButtonContext);

  useEffect(() => {
    controlButtonContext.onLeftButtonPressed = controlButtonActions.onLeftButtonPressed;
    controlButtonContext.onMiddleButtonPressed = controlButtonActions.onMiddleButtonPressed;
    controlButtonContext.onRightButtonPressed = controlButtonActions.onRightButtonPressed;
  }, deps ? deps : []);

  return screen;
};
