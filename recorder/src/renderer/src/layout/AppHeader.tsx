import React from "react";
import { Toolbar, Typography, AppBar, Button, Box } from "@mui/material";
import useSoundBoard from "@hooks/useSoundBoard";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import StopIcon from "@mui/icons-material/Stop";
import store from "../store";

export interface AppHeaderProps {
  title: string;
}

export function AppHeader({ title }: AppHeaderProps) {
  const { isPlaying, start, stop, playNextVO } = useSoundBoard((e) =>
    store.notify(e.message)
  );
  return (
    <AppBar
      sx={{ borderBottom: "1px solid var(--whiteExtraLight)" }}
      elevation={0}
      position="fixed"
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" noWrap component="div">
          {title}
        </Typography>
        {!isPlaying && (
          <Button
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
              gridTemplateColumns: "1fr 50px",
            }}
          >
            <Button
              variant="contained"
              startIcon={<StopIcon />}
              onClick={() => stop()}
            >
              Stop Session
            </Button>
            <Button
              variant="text"
              startIcon={<SkipNextIcon />}
              onClick={() => playNextVO()}
            />
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
