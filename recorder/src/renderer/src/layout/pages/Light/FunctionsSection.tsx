import { Section } from "@components/layout/Section";
import { Button, Stack } from "@mui/material";
import { QLCFunction } from "@shared/enums";
import React from "react";

export function FunctionsSection() {
  const handleClick = (qlcFunction: QLCFunction) => {
    window.rumor.actions.light.triggerFunction(qlcFunction);
  };
  return (
    <Section title="Functions">
      <Stack direction="row" sx={{ mb: 2 }}>
        <Button
          sx={{ width: "100%" }}
          variant="contained"
          onClick={() => handleClick(QLCFunction.FADE_TO_MAX_LIGHT_INTENSITY)}
        >
          Fade to max light intensity
        </Button>
      </Stack>
      <Stack direction="row" sx={{ mb: 2 }}>
        <Button
          sx={{ width: "100%" }}
          variant="contained"
          onClick={() =>
            handleClick(QLCFunction.FADE_TO_DIMMED_LIGHT_INTENSITY)
          }
        >
          Fade to dimmed light intensity
        </Button>
      </Stack>
      <Stack direction="row" sx={{ mb: 2 }}>
        <Button
          sx={{ width: "100%" }}
          variant="contained"
          onClick={() => handleClick(QLCFunction.FADE_TO_BLACKOUT)}
        >
          Fade to blackout
        </Button>
      </Stack>
      <Stack direction="row" sx={{ mb: 2 }}>
        <Button
          sx={{ width: "100%" }}
          variant="contained"
          onClick={() => handleClick(QLCFunction.BLACKOUT)}
        >
          Blackout
        </Button>
      </Stack>
    </Section>
  );
}
