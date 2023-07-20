import React, { useCallback } from "react";
import { Section } from "@components/layout/Section";
import { Button } from "@mui/material";
import { toast } from "react-toastify";

export function LoggingSettingsSection() {
  const removeAllLogging = useCallback(async () => {
    window.rumor.methods.removeAllLogging().then(() => {
      toast("Logging has been removed");
    });
  }, []);
  return (
    <Section title="Logging">
      <Button
        sx={{ width: "100%" }}
        variant="contained"
        onClick={removeAllLogging}
      >
        Remove all logging
      </Button>
    </Section>
  );
}
