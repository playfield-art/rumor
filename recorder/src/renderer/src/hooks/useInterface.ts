export const useInterface = () => {
  const changeInterfacePage = (page: string) =>
    window.rumor.actions.interface.changeInterfacePage(page);

  const pressButtonInterface = (button: number) =>
    window.rumor.actions.interface.pressButtonInterface(button);

  return { changeInterfacePage, pressButtonInterface };
};
