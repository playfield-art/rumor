/**
 * This controller will activate the sync with the CMS
 */

import { existsSync } from "fs";
import { Narrative, NotifciationType } from "@shared/interfaces";
import { getNarrative, uploadToCms as utcms } from "../lib/cms";
import { Exception } from "../lib/exceptions/Exception";
import { getNarrativesFolder } from "../lib/filesystem";
import { NarrativeSyncer } from "../lib/narrative/NarrativeSyncer";
import SettingsHelper from "../lib/settings/SettingHelper";
import { Recorder } from "../recorder";
import { CronSyncSingleton } from "../lib/cron/CronSyncSingleton";
import Logger from "../lib/logging/Logger";

/**
 * Syncs the narrative that we got from the cloud
 */
export const syncNarrative = async (): Promise<void> => {
  try {
    // get the boothslug from settings
    const boothSlug = await SettingsHelper.getBoothSlug();

    // validate the booth slug
    if (!boothSlug) {
      throw new Exception({
        message: "There was no boothSlug found in the settings.",
        where: "syncNarrative",
      });
    }

    // let them know, the process is continuing
    Recorder.changeProces({
      procesIsRunning: true,
      message: "Getting the narrative from CMS...",
    });

    // get the narrative
    const narrative: Narrative = await getNarrative(boothSlug);

    // let them know, the process is continuing
    Recorder.changeProces({
      procesIsRunning: true,
      message: "Getting the narratives folder on local machine...",
    });

    // get the narratives folder and start syncing
    const narrativesFolder = await getNarrativesFolder();

    // if folders exists, start syncing
    if (narrative && existsSync(narrativesFolder)) {
      await new NarrativeSyncer(
        narrativesFolder,
        narrative,
        (message: string) => {
          // let them know, the process is continuing
          Recorder.changeProces({
            procesIsRunning: true,
            message,
          });
        }
      ).start();
    }

    // let them know that the proces is over
    Recorder.changeProces({ procesIsRunning: false });
    Recorder.notification({
      message: "Narrative successfully synced!",
      type: NotifciationType.INFO,
    });
  } catch (e: any) {
    Recorder.changeProces({ procesIsRunning: false });
    Recorder.notification({ message: e.message, type: NotifciationType.ERROR });
    throw new Exception({ where: "syncNarrative", message: e.message });
  }
};

/**
 * Upload recordings to CMS
 */
export const uploadToCms = async (): Promise<void> => {
  try {
    await utcms(
      async (message) => {
        // add the message to the log
        await Logger.detail(message);

        // let them know, the process is continuing
        Recorder.changeProces({
          procesIsRunning: true,
          message,
        });
      },
      () => {
        const finishedMessage =
          "Sessions were successfully uploaded to the CMS!";
        Recorder.changeProces({ procesIsRunning: false });
        Recorder.notification({
          message: finishedMessage,
          type: NotifciationType.INFO,
        });
        // log
        Logger.success(finishedMessage);
      }
    );
  } catch (e: any) {
    Recorder.changeProces({ procesIsRunning: false });
    Recorder.notification({ message: e.message, type: NotifciationType.ERROR });
    throw new Exception({ where: "uploadToCms", message: e.message });
  }
};

/**
 * Set the cron sync to a new expression
 * @param expression The new cron expression
 */
export const setCronSync = (
  event: Electron.IpcMainInvokeEvent,
  expression: string
): void => {
  try {
    CronSyncSingleton.getInstance().scheduleAndStart(expression);
    SettingsHelper.setSetting("syncCronjob", expression);
  } catch (e: any) {
    throw new Exception({ where: "setCronSync", message: e.message });
  }
};
