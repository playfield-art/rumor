import { useLogger } from "./useLogger";

export const useInterface = () => {
  const { detail } = useLogger();

  /**
   * Change the page on the interface
   * @param page
   * @returns
   */
  const changeInterfacePage = (page: string) =>
    window.rumor.actions.interface.changeInterfacePage(page);

  /**
   * Pressing a button on the interface
   * @param button
   * @returns
   */
  const pressButtonInterface = (button: number) =>
    window.rumor.actions.interface.pressButtonInterface(button);

  /**
   * Turn on screen on or off
   * @param on
   */
  const screen = (on: boolean) => {
    window.rumor.methods.publishTopic("interface/screen", {
      state: on ? 1 : 0,
    });

    // log
    detail(`Interface screen is turned ${on ? "on" : "off"}.`);
  };

  return { changeInterfacePage, pressButtonInterface, screen };
};
