import React from "react";
import { Grid, Stack } from "@mui/material";
import { FolderSettingsSection } from "./FolderSettingsSection";
import { RecorderSettingsSection } from "./RecorderSettingsSection";
import { LoggingSettingsSection } from "./LoggingSettingsSection";
import { MqttSettingsSection } from "./MqttSettingsSection";
import { QLCSection } from "./QLCSection";

export function Settings() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Stack spacing={2} display="block">
          <RecorderSettingsSection />
        </Stack>
      </Grid>
      <Grid item xs={12} md={6}>
        <Stack spacing={2} display="block">
          <LoggingSettingsSection />
          <MqttSettingsSection />
        </Stack>
      </Grid>
      <Grid item xs={12} md={12}>
        <Stack spacing={2} display="block">
          <QLCSection />
          <FolderSettingsSection />
        </Stack>
      </Grid>
    </Grid>
  );
}
