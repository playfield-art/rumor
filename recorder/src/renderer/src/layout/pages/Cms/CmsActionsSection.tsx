import React from "react";
import { ButtonContainer } from "@components";
import { Section } from "@components/layout/Section";
import { observer } from "mobx-react";
import Button from "@mui/material/Button";

function CmsActionsSection() {
  return (
    <Section title="Actions">
      <ButtonContainer>
        <Button
          type="button"
          variant="contained"
          onClick={async () => {
            window.rumor.methods.syncNarrative();
          }}
        >
          Sync Narrative
        </Button>
      </ButtonContainer>
      <ButtonContainer>
        <Button
          type="button"
          variant="contained"
          onClick={async () => window.rumor.methods.uploadToCms()}
        >
          Upload To CMS
        </Button>
      </ButtonContainer>
    </Section>
  );
}

export default observer(CmsActionsSection);
