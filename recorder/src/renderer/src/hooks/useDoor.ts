import { IDoorState } from "@shared/interfaces";
import { useEffect, useState } from "react";

export const useDoor = () => {
  const [currentDoorState, setCurrentDoorState] = useState<IDoorState>({
    open: false,
    battery: 0,
  });

  useEffect(() => {
    // listen for door state changes
    const removeEventListenerOnDoorState = window.rumor.events.onDoorState(
      (event, doorState) => {
        setCurrentDoorState(doorState);
      }
    );

    return () => {
      removeEventListenerOnDoorState();
    };
  });

  return { currentDoorState };
};
