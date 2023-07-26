import { useRecorderStore } from "@hooks/useRecorderStore";
import { Box, Typography } from "@mui/material";
import React from "react";

export function CurrentLanguage() {
  const currentLanguage = useRecorderStore((state) => state.currentLanguage);

  return (
    <Box sx={{ color: "var(--grey-1000)" }}>
      <Typography>{currentLanguage.toUpperCase()}</Typography>
    </Box>
  );
}
