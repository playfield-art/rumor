import { SerialButton } from "./SerialButton";

/**
 * The Singleton class defines the `getInstance` method that lets clients access
 * the unique singleton instance.
 */
export class SerialButtonSingleton {
  private static instance: SerialButton;

  /**
   * The Singleton's constructor should always be private to prevent direct
   * construction calls with the `new` operator.
   */
  private constructor() {}

  /**
   * Sets the single instance
   */
  public static setInstance(serialButtonInstance: SerialButton) {
    SerialButtonSingleton.instance = serialButtonInstance;
  }

  /**
   * The static method that controls the access to the singleton instance.
   *
   * This implementation let you subclass the Singleton class while keeping
   * just one instance of each subclass around.
   */
  public static getInstance(): SerialButton {
    return SerialButtonSingleton.instance;
  }
}
