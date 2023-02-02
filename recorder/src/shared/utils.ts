/**
 * An object that contains a lot of handy utils
 */

export const Utils = {
  /**
   * A function that will add a leading zero to a number
   * and return a string
   */
  addLeadingZero: (number: number | string | undefined): string => {
    let incoming = number;
    if (incoming === undefined || !incoming) incoming = 0;
    if (typeof number === "string") {
      incoming = Number(number);
    }
    return incoming < 10 ? `0${incoming}` : `${incoming}`;
  },

  /**
   * Generates a unique name by date
   * @returns
   */
  generateUniqueNameByDate: (): string => {
    const currentDate = new Date();
    const currentYear = Utils.addLeadingZero(currentDate.getFullYear());
    const currentMonth = Utils.addLeadingZero(currentDate.getMonth() + 1);
    const currentDay = Utils.addLeadingZero(currentDate.getUTCDate());
    const currentHours = Utils.addLeadingZero(currentDate.getHours());
    const currentMinutes = Utils.addLeadingZero(currentDate.getMinutes());
    const currentSeconds = Utils.addLeadingZero(currentDate.getSeconds());
    return `${currentYear}${currentMonth}${currentDay}-${currentHours}${currentMinutes}${currentSeconds}`;
  },

  /**
   * Gets the current date in DD/MM/YYYY version
   * @return The current date in DD/MM/YYYY version
   */
  currentDate: (): string => {
    const currentDate = new Date();
    const currentYear = Utils.addLeadingZero(currentDate.getFullYear());
    const currentMonth = Utils.addLeadingZero(currentDate.getMonth() + 1);
    const currentDay = Utils.addLeadingZero(currentDate.getUTCDate());
    return `${currentDay}/${currentMonth}/${currentYear}`;
  },

  /**
   * Gets the current time
   * @returns The current time
   */
  currentTime: (): string => {
    const currentDate = new Date();
    const currentHours = Utils.addLeadingZero(currentDate.getHours());
    const currentMinutes = Utils.addLeadingZero(currentDate.getMinutes());
    const currentSeconds = Utils.addLeadingZero(currentDate.getSeconds());
    return `${currentHours}:${currentMinutes}:${currentSeconds}`;
  },

  /**
   * A function that will capitalize the first letter of string
   * @param s
   * @returns
   */
  capitalize: (s: string) => (s && s[0].toUpperCase() + s.slice(1)) || "",
};
