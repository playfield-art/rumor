import { createContext } from 'react';
import { ControlButtonActions } from './interfaces';

export default createContext<ControlButtonActions>({
  onLeftButtonPressed: () => {
    console.log('Left button pressed');
  },
  onMiddleButtonPressed: () => {
    console.log('Middle button pressed');
  },
  onRightButtonPressed() {
    console.log('Right button pressed');
  },
});