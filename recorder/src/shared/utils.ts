/**
 * An object that contains a lot of handy utils
 */

export const Utils = {
  /**
   * A function that will add a leading zero to a number
   * and return a string
   */
  addLeadingZero: (number: number | string | undefined): string => {
    let incoming = Number(number);
    if (incoming === undefined || !incoming) incoming = 0;
    if (typeof number === "string") {
      incoming = Number(number);
    }
    return incoming < 10 ? `0${incoming}` : `${incoming}`;
  },

  delay: async (time: number) =>
    new Promise((resolve) => {
      setTimeout(resolve, time);
    }),

  /**
   * A function that will format bytes to a human readable format
   * @param bytes The bytes to format
   * @param decimals The amount of decimals to use
   * @returns
   */
  formatBytes: (bytes: number, decimals = 2) => {
    if (!+bytes) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = [
      "Bytes",
      "KiB",
      "MiB",
      "GiB",
      "TiB",
      "PiB",
      "EiB",
      "ZiB",
      "YiB",
    ];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
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

  /**
   * Makes a random id for us
   */
  makeRandomId: (length: number) => {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  },
};
