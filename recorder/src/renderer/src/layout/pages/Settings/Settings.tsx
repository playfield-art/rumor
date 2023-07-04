import React from "react";
import { Grid } from "@mui/material";
import { FolderSettingsSection } from "./FolderSettingsSection";
import { RecorderSettingsSection } from "./RecorderSettingsSection";

export function Settings() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <RecorderSettingsSection />
      </Grid>
      <Grid item xs={12} md={6}>
        <FolderSettingsSection />
      </Grid>
    </Grid>
  );
}
