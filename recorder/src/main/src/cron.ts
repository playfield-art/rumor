import { CronSync } from "./lib/cron/CronSync";
import { CronSyncSingleton } from "./lib/cron/CronSyncSingleton";
import SettingHelper from "./lib/settings/SettingHelper";

/**
 * Init the cron job
 */
export const initCronSync = async () => {
  // create a new cron job
  const cronjob = new CronSync(() => {
    // @todo sync the narrative
    console.log("we are doing something");
  });

  // get the cronjob setting
  const cronSynSetting = await SettingHelper.getSetting("syncCronjob");

  // whenever we have a setting, run the setting
  if (cronSynSetting && cronSynSetting.value) {
    // start the cron job
    cronjob.scheduleAndStart(cronSynSetting.value);
  }

  // set the singleton instance
  CronSyncSingleton.setInstance(cronjob);
};
