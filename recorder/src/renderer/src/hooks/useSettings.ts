import { useState, useEffect } from "react";

const useSettings = () => {
  const [currentNarrativesFolder, setCurrentNarrativesFolder] = useState<string | null>('');
  const [currentRecordingsFolder, setCurrentRecordingsFolder] = useState<string | null>('');

  useEffect(() => {
    const getSettings = async () => {
      setCurrentNarrativesFolder((await window.rumor.methods.getSetting('narrativesFolder')));
      setCurrentRecordingsFolder((await window.rumor.methods.getSetting('recordingsFolder')));
    }
    getSettings();
  }, [])

  return {
    currentNarrativesFolder,
    setCurrentNarrativesFolder,
    currentRecordingsFolder,
    setCurrentRecordingsFolder
  };
};

export default useSettings;
