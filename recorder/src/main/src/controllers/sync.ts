/**
 * This controller will activate the sync with the CMS
 */

import { existsSync } from "fs";
import { Narrative, NotifciationType } from "@shared/interfaces";
import { getNarrative, uploadSessions } from "../lib/cms";
import { Exception } from "../lib/exceptions/Exception";
import { getNarrativesFolder, getRecordingsFolder } from "../lib/filesystem";
import { NarrativeSyncer } from "../lib/narrative/NarrativeSyncer";
import { SessionFactory } from "../lib/sessions/SessionFactory";
import SettingsHelper from "../lib/settings/SettingHelper";
import { Recorder } from "../recorder";
import { CronSyncSingleton } from "../lib/cron/CronSyncSingleton";
import { Mp3Converter } from "../lib/audio/Mp3Converter";
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
    const notifyFrontend = false;

    // Log
    await Logger.info("Starting upload to CMS...");

    // let them know, the process is continuing
    if (notifyFrontend)
      Recorder.changeProces({
        procesIsRunning: true,
        message: "Inventorising the sessions on our device...",
      });

    // get the recordings folder from settings
    const sessionFolder = await getRecordingsFolder();

    // validate
    if (!sessionFolder || !existsSync(sessionFolder)) {
      if (notifyFrontend)
        Recorder.changeProces({
          procesIsRunning: true,
          message: "Session folder is not there or does not exist",
        });
    }

    /**
     * Get all the sessions from local hard drive
     */

    // get the sessions on this machine
    let sessions = await new SessionFactory(sessionFolder).getSessions();

    // remove the last session from array, this prevents that the sessions
    // gets uploaded before it is finished
    sessions = sessions.slice(0, sessions.length - 1);

    // validate
    if (!sessions || sessions.length === 0) {
      await Logger.info("No uploadable sessions found.");
      return;
    }

    // log
    await Logger.detail(
      `Found ${sessions.length} uploadable sessions on this device.`
    );

    /**
     * Convert the files to mp3
     */

    // Before we start uploading:
    // 1. Create the filepahts of the current WAV recording
    // 2. Clear the recordings that are empty
    // 3. Join the objects together in an array of strings
    const filePaths = sessions
      .map((session) =>
        session.recordings
          .filter((r) => !r.isEmpty)
          .map((recording) => recording.fullPath)
      )
      .reduce((acc, curr) => acc.concat(curr), []);

    // convert the files
    if (filePaths) {
      try {
        await Mp3Converter.convert(filePaths);
        await Logger.detail(`Converted ${filePaths.length} file(s) to mp3.`);
      } catch (e: any) {
        await Logger.error(`Could not convert ${filePaths} to mp3.`);
      }
    }

    /**
     * Upload the sessions to the CMS
     */

    // upload the sessions
    await uploadSessions(sessions, async (message) => {
      await Logger.detail(message);
      // let them know, the process is continuing
      if (notifyFrontend)
        Recorder.changeProces({
          procesIsRunning: true,
          message,
        });
    });

    // let them know that the proces is over
    if (notifyFrontend) {
      Recorder.changeProces({ procesIsRunning: false });
      Recorder.notification({
        message: "Sessions were successfully uploaded to the CMS!",
        type: NotifciationType.INFO,
      });
    }

    // log
    await Logger.success(`Sessions were successfully uploaded to the CMS!`);
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
