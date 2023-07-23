import React from "react";
import { Section } from "@components/layout/Section";
import { Button, Stack } from "@mui/material";
import { useInterface } from "@hooks/useInterface";

function SimulateControl() {
  const { pressButtonInterface } = useInterface();
  return (
    <Section title="Simulate Control">
      <Stack direction="row" spacing={2} useFlexGap>
        <Button
          style={{
            width: "100%",
            backgroundColor: "var(--blue)",
          }}
          variant="contained"
          onClick={() => pressButtonInterface(1)}
        >
          Left
        </Button>
        <Button
          style={{
            width: "100%",
            backgroundColor: "var(--white)",
            color: "var(--blue)",
          }}
          variant="contained"
          onClick={() => pressButtonInterface(2)}
        >
          Middle
        </Button>
        <Button
          style={{
            width: "100%",
            backgroundColor: "var(--blue)",
          }}
          variant="contained"
          onClick={() => pressButtonInterface(3)}
        >
          Right
        </Button>
      </Stack>
    </Section>
  );
}

export default SimulateControl;
