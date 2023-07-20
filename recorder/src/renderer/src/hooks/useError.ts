import { toast } from "react-toastify";
import { useLogger } from "./useLogger";

export const useError = () => {
  const { error } = useLogger();

  const showError = (e: Error) => {
    toast(e.message); // show in interface
    error(e.message); // log
  };

  return { showError };
};
