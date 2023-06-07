import React, { useEffect } from "react";
import { ButtonContainer } from "@components";
import { Section } from "@components/layout/Section";
import useSoundBoard from "@hooks/useSoundBoard";
import { observer } from "mobx-react";
import store from "../store";

function ActionsSection() {
  const { playNextVO, stop, start, isPlaying, currentSC, currentVO } =
    useSoundBoard((e) => store.notify(e.message));

  useEffect(() => {
    store.currentSC = currentSC;
  }, [currentSC]);

  useEffect(() => {
    store.currentVO = currentVO;
  }, [currentVO]);

  return (
    <Section title="Actions">
      {!isPlaying && (
        <ButtonContainer>
          <button type="button" onClick={() => start()}>
            Start Soundboard
          </button>
        </ButtonContainer>
      )}
      {isPlaying && (
        <ButtonContainer>
          <button type="button" onClick={() => stop()}>
            Stop Soundboard
          </button>
        </ButtonContainer>
      )}
      <ButtonContainer>
        <button
          disabled={isPlaying === false}
          type="button"
          onClick={() => playNextVO()}
        >
          Next Voice Over
        </button>
      </ButtonContainer>
      <ButtonContainer>
        <button
          type="button"
          onClick={async () => {
            window.rumor.methods.syncNarrative();
          }}
        >
          Sync Narrative
        </button>
      </ButtonContainer>
      <ButtonContainer>
        <button
          type="button"
          onClick={async () => window.rumor.methods.uploadToCms()}
        >
          Upload To CMS
        </button>
      </ButtonContainer>
    </Section>
  );
}

export default observer(ActionsSection);
