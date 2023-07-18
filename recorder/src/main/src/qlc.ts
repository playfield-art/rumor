import { QLC } from "./lib/qlc/QLC";
import { QLCSingleton } from "./lib/qlc/QLCSingleton";

/**
 * Init QLC
 */
export const initQLC = async () => {
  QLCSingleton.setInstance(new QLC("192.168.50.30", 7700));
};
