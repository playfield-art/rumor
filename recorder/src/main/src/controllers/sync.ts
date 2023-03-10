/**
 * This controller will activate the sync with the CMS
 */

import { Narrative, NotifciationType } from "@shared/interfaces";
import { existsSync } from "fs";
import { getNarrative, uploadSessions } from "../lib/cms";
import { Exception } from "../lib/exceptions/Exception";
import { getNarrativesFolder, getRecordingsFolder } from "../lib/filesystem";
import { NarrativeSyncer } from "../lib/narrative/NarrativeSyncer";
import { SessionFactory } from "../lib/sessions/SessionFactory";
import SettingsHelper from "../lib/settings/SettingHelper";
import { Recorder } from "../recorder";

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
    Recorder.notifcation({
      message: "Narrative successfully synced!",
      type: NotifciationType.INFO,
    });
  } catch (e: any) {
    Recorder.changeProces({ procesIsRunning: false });
    Recorder.notifcation({ message: e.message, type: NotifciationType.ERROR });
    throw new Exception({ where: "syncNarrative", message: e.message });
  }
};

/**
 * Upload recordings to CMS
 */
export const uploadToCms = async (): Promise<void> => {
  try {
    // let them know, the process is continuing
    Recorder.changeProces({
      procesIsRunning: true,
      message: "Inventorising the sessions on our device...",
    });

    // get the recordings folder from settings
    const sessionFolder = await getRecordingsFolder();

    // validate
    if (!sessionFolder || !existsSync(sessionFolder)) {
      Recorder.changeProces({
        procesIsRunning: true,
        message: "Session folder is not there or does not exist",
      });
    }

    // get the sessions on this machine
    const sessions = await new SessionFactory(sessionFolder).getSessions();

    // if we have sessions, start uploading them
    if (sessions && sessions.length > 0)
      await uploadSessions(sessions, (message) => {
        // let them know, the process is continuing
        Recorder.changeProces({
          procesIsRunning: true,
          message,
        });
      });

    // let them know that the proces is over
    Recorder.changeProces({ procesIsRunning: false });
    Recorder.notifcation({
      message: "Sessions were successfully uploaded to the CMS!",
      type: NotifciationType.INFO,
    });
  } catch (e: any) {
    Recorder.changeProces({ procesIsRunning: false });
    Recorder.notifcation({ message: e.message, type: NotifciationType.ERROR });
    throw new Exception({ where: "uploadToCms", message: e.message });
  }
};
