import { useState, useEffect } from "react";

const useSettings = () => {
  const [currentNarrativesFolder, setCurrentNarrativesFolder] = useState<
    string | null
  >("");
  const [currentRecordingsFolder, setCurrentRecordingsFolder] = useState<
    string | null
  >("");
  const [currentArchiveFolder, setCurrentArchiveFolder] = useState<
    string | null
  >("");

  useEffect(() => {
    const getSettings = async () => {
      setCurrentNarrativesFolder(
        await window.rumor.methods.getSetting("narrativesFolder")
      );
      setCurrentRecordingsFolder(
        await window.rumor.methods.getSetting("recordingsFolder")
      );
      setCurrentArchiveFolder(
        await window.rumor.methods.getSetting("archiveFolder")
      );
    };
    getSettings();
  }, []);

  /**
   * Save a specific setting
   * @param key
   * @param value
   * @returns
   */
  const saveSetting = async (key: string, value: any) =>
    window.rumor.actions.saveSetting({ key, value });

  /**
   * Get a specific setting
   * @param key
   */
  const getSetting = async (key: string) =>
    window.rumor.methods.getSetting(key);

  /**
   * Sets a file setting
   * @param key The key of the file setting
   */
  const setFileSetting = async (key: string, filters?: Electron.FileFilter[]) =>
    window.rumor.methods.setFileSetting(key, filters);

  return {
    saveSetting,
    getSetting,
    setFileSetting,
    currentNarrativesFolder,
    setCurrentNarrativesFolder,
    currentRecordingsFolder,
    setCurrentRecordingsFolder,
    currentArchiveFolder,
    setCurrentArchiveFolder,
  };
};

export default useSettings;
