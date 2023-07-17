import { Section } from "@components/layout/Section";
import { Button, Stack } from "@mui/material";
import React from "react";

export function FunctionsSection() {
  const handleClick = (functionName: string) => {
    // do something on backend
  };
  return (
    <Section title="Functions">
      <Stack direction="row" sx={{ mb: 2 }}>
        <Button
          sx={{ width: "100%" }}
          variant="contained"
          onClick={() => handleClick("fadeToMaxLightIntensity")}
        >
          Fade to max light intensity
        </Button>
      </Stack>
      <Stack direction="row" sx={{ mb: 2 }}>
        <Button
          sx={{ width: "100%" }}
          variant="contained"
          onClick={() => handleClick("fadeToDimmedLightIntensity")}
        >
          Fade to dimmed light intensity
        </Button>
      </Stack>
      <Stack direction="row" sx={{ mb: 2 }}>
        <Button
          sx={{ width: "100%" }}
          variant="contained"
          onClick={() => handleClick("fadeToBlackout")}
        >
          Fade to blackout
        </Button>
      </Stack>
      <Stack direction="row" sx={{ mb: 2 }}>
        <Button
          sx={{ width: "100%" }}
          variant="contained"
          onClick={() => handleClick("blackout")}
        >
          Blackout
        </Button>
      </Stack>
    </Section>
  );
}
