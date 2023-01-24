import React from "react";
import { AppContainer, ButtonContainer } from "@components";
import { AppVerticalContainer } from "@components/layout/AppContainer";
import SelectFolder from "@components/SelectFolder";
import { StatusContainer } from "@components/StatusContainer";
import useSettings from "@hooks/useSettings";
import useSoundBoard from "@hooks/useSoundBoard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const notifyError = (e: Error) => toast(e.message);
  const {
    currentNarrativesFolder,
    setCurrentNarrativesFolder,
    currentRecordingsFolder,
    setCurrentRecordingsFolder,
  } = useSettings();
  const { playNextVO, stop, start, started, currentSC, currentVO } =
    useSoundBoard(notifyError);

  return (
    <AppContainer>
      <AppVerticalContainer>
        {!started && (
          <ButtonContainer>
            <button type="button" onClick={() => start()}>
              Start Soundboard
            </button>
          </ButtonContainer>
        )}
        {started && (
          <ButtonContainer>
            <button type="button" onClick={() => stop()}>
              Stop Soundboard
            </button>
          </ButtonContainer>
        )}
        <ButtonContainer>
          <button type="button" onClick={() => playNextVO()}>
            Next Voice Over
          </button>
        </ButtonContainer>
        <ButtonContainer>
          <button
            type="button"
            onClick={async () => window.rumor.methods.syncNarrative()}
          >
            Sync Narrative
          </button>
          <button
            type="button"
            onClick={async () => window.rumor.methods.uploadToCms()}
          >
            Upload To CMS
          </button>
        </ButtonContainer>
        <ButtonContainer>
          <SelectFolder
            path={currentNarrativesFolder || ""}
            label="NAR"
            onClick={async () => {
              setCurrentNarrativesFolder(
                await window.rumor.methods.setNarrativesFolder()
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
      </AppVerticalContainer>
      <AppVerticalContainer>
        <StatusContainer>
          {!currentVO && !currentSC && "No current status."}
          {currentVO && (
            <div>
              {currentVO ? `Current Chapter: ${currentVO.chapter}` : ""}
            </div>
          )}
          {currentVO && (
            <div>
              {currentVO ? `Current Voice Over: ${currentVO.fileName}` : ""}
            </div>
          )}
          {currentSC && (
            <div>
              {currentSC
                ? `Current Soundscape: ${currentSC.startsAt.chapter}`
                : ""}
            </div>
          )}
        </StatusContainer>
      </AppVerticalContainer>
      <ToastContainer />
    </AppContainer>
  );
}

export default App;
