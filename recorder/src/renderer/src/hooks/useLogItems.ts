import { useEffect, useState } from "react";
import { ILogRow } from "@shared/interfaces";

export const useLogItems = () => {
  const [currentLogRows, setCurrentLogRows] = useState<ILogRow[]>([]);

  /**
   * When our hook is mounted, poll for logging
   */
  useEffect(() => {
    window.rumor.methods.getAllLogRows().then((logRows) => {
      setCurrentLogRows(logRows);
    });

    const pollForLogging = setInterval(() => {
      window.rumor.methods.getAllLogRows().then((logRows) => {
        setCurrentLogRows(logRows);
      });
    }, 500);

    return () => {
      clearInterval(pollForLogging);
    };
  }, []);

  // return the current logging
  return currentLogRows;
};
