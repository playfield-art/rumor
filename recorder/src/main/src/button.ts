import SoundBoard from "./lib/audio/SoundBoard";
import { getSerialPorts } from "./lib/serial/Serial";
import { SerialButton } from "./lib/serial/SerialButton";
import { SerialButtonSingleton } from "./lib/serial/SerialButtonSingleton";

/**
 * Init the serial button
 */
export const initSerialButton = async () => {
  const serialPorts = await getSerialPorts();
  const usbSerialPort = serialPorts.find((port) => port.includes("usbmodem"));
  if (usbSerialPort) {
    SerialButtonSingleton.setInstance(
      new SerialButton({
        path: usbSerialPort,
        onButtonUp: () => {
          SoundBoard.next();
        },
      })
    );
  }
};
