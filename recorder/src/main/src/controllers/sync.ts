/**
 * This controller will activate the sync with the CMS
 */

import { Narrative } from "@shared/interfaces";
import { existsSync } from "fs";
import { getNarrative, uploadSessions } from "../lib/cms";
import { Exception } from "../lib/exceptions/Exception";
import { getNarrativesFolder, getRecordingsFolder } from "../lib/filesystem";
import { NarrativeSyncer } from "../lib/narrative/NarrativeSyncer";
import { SessionFactory } from "../lib/sessions/SessionFactory";
import SettingsHelper from "../lib/settings/SettingHelper";

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

    // get the narrative
    const narrative: Narrative = await getNarrative(boothSlug);

    // get the narratives folder and start syncing
    const narrativesFolder = await getNarrativesFolder();

    if (narrative && existsSync(narrativesFolder)) {
      await new NarrativeSyncer(narrativesFolder, narrative).start();
    }
  } catch (e: any) {
    throw new Exception({ where: "syncNarrative", message: e.message });
  }
};

/**
 * Upload recordings to CMS
 */
export const uploadToCms = async (): Promise<void> => {
  try {
    const sessionFolder = await getRecordingsFolder();
    if (sessionFolder && existsSync(sessionFolder)) {
      const sessions = await new SessionFactory(sessionFolder).getSessions();
      if (sessions && sessions.length > 0) await uploadSessions(sessions);
    }
  } catch (e: any) {
    throw new Exception({ where: "uploadToCms", message: e.message });
  }
};
