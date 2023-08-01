import { uploadToCms } from "./lib/cms";
import { CronSync } from "./lib/cron/CronSync";
import { CronSyncSingleton } from "./lib/cron/CronSyncSingleton";
import Logger from "./lib/logging/Logger";
import SettingHelper from "./lib/settings/SettingHelper";

/**
 * Init the cron job
 */
export const initCronSync = async () => {
  // create a new cron job
  const cronjob = new CronSync(async () => {
    const syncCronjobActiveSetting = await SettingHelper.getSetting(
      "syncCronjobActive"
    );

    // check if we are allowed to activate the cronjob?
    const syncCronjobActive =
      Boolean(Number(syncCronjobActiveSetting?.value)) ?? false;

    if (syncCronjobActive) {
      uploadToCms(
        async (message: string) => {
          await Logger.detail(message);
        },
        () => {
          Logger.success("Sessions were successfully uploaded to the CMS!");
        }
      );
    }
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
