import React from "react";
import { Section } from "@components/layout/Section";
import { Button, Stack } from "@mui/material";
import { useInterface } from "@hooks/useInterface";

function ScreenControlSection() {
  const { screen } = useInterface();
  return (
    <Section title="Screen Control">
      <Stack direction="column" spacing={2} useFlexGap>
        <Button variant="contained" onClick={() => screen(true)}>
          On
        </Button>
        <Button variant="contained" onClick={() => screen(false)}>
          Off
        </Button>
      </Stack>
    </Section>
  );
}

export default ScreenControlSection;
