import { Section } from "@components/layout/Section";
import { useInterface } from "@hooks/useInterface";
import { Button, Stack } from "@mui/material";
import React from "react";

function ChangePageSection() {
  const { changeInterfacePage } = useInterface();
  return (
    <Section title="Change Page">
      <Stack direction="column" spacing={2} useFlexGap>
        <Button
          sx={{ width: "100%" }}
          variant="contained"
          onClick={() => changeInterfacePage("set-language")}
        >
          Set Language
        </Button>
        <Button
          sx={{ width: "100%" }}
          variant="contained"
          onClick={() => changeInterfacePage("start-countdown")}
        >
          Start Countdown
        </Button>
        <Button
          sx={{ width: "100%" }}
          variant="contained"
          onClick={() => changeInterfacePage("during-performance")}
        >
          During Performance
        </Button>
        <Button
          sx={{ width: "100%" }}
          variant="contained"
          onClick={() => changeInterfacePage("door-is-open")}
        >
          Door Is Open
        </Button>
        <Button
          sx={{ width: "100%" }}
          variant="contained"
          onClick={() => changeInterfacePage("session-finished")}
        >
          Session Finished
        </Button>
      </Stack>
    </Section>
  );
}

export default ChangePageSection;
