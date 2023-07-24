export const useInterface = () => {
  const changeInterfacePage = (page: string) =>
    window.rumor.actions.interface.changeInterfacePage(page);

  const pressButtonInterface = (button: number) =>
    window.rumor.actions.interface.pressButtonInterface(button);

  const screen = (on: boolean) =>
    window.rumor.methods.publishTopic("interface/screen", {
      state: on ? 1 : 0,
    });

  return { changeInterfacePage, pressButtonInterface, screen };
};
