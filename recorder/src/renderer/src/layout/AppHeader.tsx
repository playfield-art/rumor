import React from "react";
import { Toolbar, AppBar, Button, Box, Divider, Stack } from "@mui/material";
import useSoundBoard from "@hooks/useSoundBoard";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import StopIcon from "@mui/icons-material/Stop";
import { useRecorderStore } from "@hooks/useRecorderStore";
import { MqttConnection } from "./MqttConnection";
import { DoorState } from "./DoorState";

export interface AppHeaderProps {
  title: string;
}

export function AppHeader() {
  const isPlaying = useRecorderStore((state) => state.isPlaying);
  const { start, stop, playNextVO } = useSoundBoard();
  return (
    <AppBar
      sx={{ borderBottom: "1px solid var(--whiteExtraLight)" }}
      elevation={0}
      position="fixed"
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Stack
          direction="row"
          divider={
            <Divider
              sx={{ borderColor: "var(--whiteExtraLight)" }}
              orientation="vertical"
              flexItem
            />
          }
          spacing={2}
        >
          <MqttConnection />
          <DoorState />
        </Stack>

        {!isPlaying && (
          <Button
            tabIndex={-1}
            variant="record"
            size="small"
            startIcon={<FiberManualRecordIcon />}
            onClick={() => start()}
          >
            Start Session
          </Button>
        )}
        {isPlaying && (
          <Box
            sx={{
              display: "grid",
              gap: "20px",
              gridTemplateColumns: "1fr 45px",
            }}
          >
            <Button
              tabIndex={-1}
              variant="contained"
              startIcon={<StopIcon />}
              onClick={() => stop()}
            >
              Stop Session
            </Button>
            <Button
              variant="text"
              startIcon={<SkipNextIcon />}
              onClick={async () => playNextVO()}
            />
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
