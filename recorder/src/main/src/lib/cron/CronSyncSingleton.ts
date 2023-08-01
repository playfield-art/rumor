import { CronJob } from "./CronJob";

/**
 * The Singleton class defines the `getInstance` method that lets clients access
 * the unique singleton instance.
 */
export class CronSyncSingleton {
  private static instance: CronJob;

  /**
   * The Singleton's constructor should always be private to prevent direct
   * construction calls with the `new` operator.
   */
  private constructor() {}

  /**
   * Sets the single instance
   */
  public static setInstance(cronSyncInstance: CronJob) {
    CronSyncSingleton.instance = cronSyncInstance;
  }

  /**
   * The static method that controls the access to the singleton instance.
   *
   * This implementation let you subclass the Singleton class while keeping
   * just one instance of each subclass around.
   */
  public static getInstance(): CronJob {
    return CronSyncSingleton.instance;
  }
}
