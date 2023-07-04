import { ButtonContainer } from "@components";
import { Section } from "@components/layout/Section";
import SelectFolder from "@components/SelectFolder";
import useSettings from "@hooks/useSettings";
import React from "react";

export function FolderSettingsSection() {
  const {
    currentNarrativesFolder,
    setCurrentNarrativesFolder,
    currentRecordingsFolder,
    setCurrentRecordingsFolder,
    currentArchiveFolder,
    setCurrentArchiveFolder,
  } = useSettings();

  return (
    <Section title="Folder Settings">
      <ButtonContainer>
        <SelectFolder
          path={currentNarrativesFolder || ""}
          label="NAR"
          onClick={async () => {
            setCurrentNarrativesFolder(
              await window.rumor.methods.setFolderSetting("narrativesFolder")
            );
          }}
        />
      </ButtonContainer>
      <ButtonContainer>
        <SelectFolder
          path={currentRecordingsFolder || ""}
          label="REC"
          onClick={async () => {
            setCurrentRecordingsFolder(
              await window.rumor.methods.setRecordingsFolder()
            );
          }}
        />
      </ButtonContainer>
      <ButtonContainer>
        <SelectFolder
          path={currentArchiveFolder || ""}
          label="ARH"
          onClick={async () => {
            setCurrentArchiveFolder(
              await window.rumor.methods.setFolderSetting("archiveFolder")
            );
          }}
        />
      </ButtonContainer>
    </Section>
  );
}
