import { ILogType } from "@shared/interfaces";
import { useCallback } from "react";

export const useLogger = () => {
  const info = useCallback((message: string) => {
    window.rumor.actions.log(message, ILogType.INFO);
  }, []);

  const error = useCallback((message: string) => {
    window.rumor.actions.log(message, ILogType.ERROR);
  }, []);

  const warn = useCallback((message: string) => {
    window.rumor.actions.log(message, ILogType.WARN);
  }, []);

  const success = useCallback((message: string) => {
    window.rumor.actions.log(message, ILogType.SUCCESS);
  }, []);

  // return the current logging
  return { info, error, warn, success };
};
