import React from "react";
import { Box } from "@mui/material";
import { useRecorderStore } from "@hooks/useRecorderStore";

export function CurrentStatus() {
  const currentVO = useRecorderStore((state) => state.currentVO);
  const currentSC = useRecorderStore((state) => state.currentSC);

  return (
    <Box
      sx={{
        color: "white",
        backgroundColor: "var(--grey-1200)",
        textAlign: "right",
        p: 2,
        pl: 4,
        pr: 4,
      }}
    >
      {!currentVO && !currentSC && "No current status."}
      {currentVO && (
        <div>{currentVO ? `Current Chapter: ${currentVO.chapter}` : ""}</div>
      )}
      {currentVO && (
        <div>
          {currentVO ? `Current Voice Over: ${currentVO.fileName}` : ""}
        </div>
      )}
      {currentSC && (
        <div>
          {currentSC ? `Current Soundscape: ${currentSC.fileName}` : ""}
        </div>
      )}
    </Box>
  );
}
