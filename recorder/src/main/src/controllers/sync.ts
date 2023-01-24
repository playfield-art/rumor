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

/**
 * Syncs the narrative that we got from the cloud
 */
export const syncNarrative = async (): Promise<void> => {
  try {
    const narrative: Narrative = await getNarrative();
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
