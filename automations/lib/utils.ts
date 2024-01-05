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
 * Change the last console line
 * @param message The message
 */
export const updatePreviousMessage = (message: string) => {
  process.stdout.moveCursor(0, -1); // Move cursor up one line
  process.stdout.clearLine(0); // Clear the line
  process.stdout.cursorTo(0); // Move cursor to the beginning of the line
  process.stdout.write(message); // Write the new message
  process.stdout.write("\n"); // Write the new message
};

/**
 * Remove quotes
 * @param message
 * @returns
 */
export const removeQuotes = (message: string): string => {
  if (message.trim().startsWith('"') && message.trim().endsWith('"')) {
    return message.slice(1, -1);
  }
  return message;
};
