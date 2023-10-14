/**
 * A file with some utils in case of a session
 */

import fs from "fs-extra";
import { Session } from "@shared/interfaces";

/**
 * Convert a session id to date and time
 * @param sessionId
 */
export const convertSessionIdToDateAndTime = (
  sessionId: string
): { date: string; time: string } => {
  // define the output
  const output = { date: "", time: "" };

  // split the session id
  const splittedSessionId = sessionId.split("-");

  // validate
  if (splittedSessionId.length !== 2) return output;

  // create the date
  const year = `${splittedSessionId[0].substring(0, 4)}`;
  const month = `${splittedSessionId[0].substring(4, 6)}`;
  const day = `${splittedSessionId[0].substring(6, 8)}`;
  output.date = `${year}-${month}-${day}`;

  // create the time
  const hours = `${splittedSessionId[1].substring(0, 2)}`;
  const minutes = `${splittedSessionId[1].substring(2, 4)}`;
  const seconds = `${splittedSessionId[1].substring(4, 6)}`;
  output.time = `${hours}:${minutes}:${seconds}`;

  // return the output
  return output;
};

/**
 * Remove unnecessary sessions
 * @param sessions
 * @returns
 */
export const validateAndRemoveUnnecessarySessions = (
  sessions: Session[]
): Session[] => {
  // validate incoming session
  if (!sessions || sessions.length === 0) return [];

  // get sessions to remove
  const sessionsToRemove = sessions.filter((s) => s.recordings.length <= 3);

  // remove the sessions
  sessionsToRemove.forEach((s) => {
    fs.rmSync(s.folder, { recursive: true });
  });

  // return the remaining sessions
  return sessions.filter((s) => s.recordings.length > 3);
};
