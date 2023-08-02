import { uploadToCms } from "./lib/cms";
import { CronJob } from "./lib/cron/CronJob";
import { CronSyncSingleton } from "./lib/cron/CronSyncSingleton";
import { makeArchiveFolderSizeSafe } from "./lib/filesystem";
import Logger from "./lib/logging/Logger";
import SettingHelper from "./lib/settings/SettingHelper";

/**
 * Init the cron job
 */
const initCronSync = async () => {
  // create a new cron job
  const cronjob = new CronJob(async () => {
    const syncCronjobActiveSetting = await SettingHelper.getSetting(
      "syncCronjobActive"
    );

    // check if we are allowed to activate the cronjob?
    const syncCronjobActive =
      Boolean(Number(syncCronjobActiveSetting?.value)) ?? false;

    // start the cronjob
    if (syncCronjobActive) {
      try {
        uploadToCms(
          async (message: string) => {
            await Logger.detail(message);
          },
          () => {
            Logger.success("Sessions were successfully uploaded to the CMS!");
          }
        );
      } catch (e: any) {
        Logger.error("Upload to CMS failed!");
      }
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

const initCronAutoRemoveArchivedSessions = async () => {
  // create a new cron job
  const cronjob = new CronJob(async () => {
    const autoRemoveArchiveCronjobActiveSetting =
      await SettingHelper.getSetting("autoRemoveArchiveCronjobActive");

    // check if we are allowed to activate the cronjob?
    const autoRemoveArchiveCronjobActive =
      Boolean(Number(autoRemoveArchiveCronjobActiveSetting?.value)) ?? false;

    // start the cronjob
    if (autoRemoveArchiveCronjobActive) {
      try {
        // make the archive folder size safe
        // makes sure that the archive folder is not bigger than 10GB
        // makes the archive folder 7.5GB big
        const info = await makeArchiveFolderSizeSafe(10000, 7500);

        // log what we did
        if (info.deletedFolders > 0)
          Logger.info(
            `Deleted ${info.deletedFolders} folder from the archive folder!`
          );
        else {
          Logger.detail(
            `Archive folder is ${info.originalArchiveFolderSize}MB and size safe!`
          );
        }
      } catch (e: any) {
        Logger.error("Upload to CMS failed!");
      }
    }
  });

  // start the cron job
  cronjob.scheduleAndStart("*/10 * * * *");
};

/**
 * Init the cron job
 */
export const initCron = async () => {
  await initCronSync();
  await initCronAutoRemoveArchivedSessions();
};

/**
 * Stop all cron jobs
 */
export const stopAllCronJobs = async () => {
  try {
    // stop the cron job
    CronSyncSingleton.getInstance()?.stop();
  } catch (e: any) {
    // Logger.error("Stopping cron job failed!");
  }
};
