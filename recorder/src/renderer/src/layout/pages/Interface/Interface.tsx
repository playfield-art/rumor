import React from "react";
import Grid from "@mui/material/Grid";
import { Stack } from "@mui/material";
import ChangePageSection from "./ChangePageSection";
import SimulateControl from "./SimulateControl";
import ScreenControlSection from "./ScreenControlSection";

export function Interface() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6} lg={4}>
        <Stack spacing={2} display="block">
          <ChangePageSection />
          <ScreenControlSection />
        </Stack>
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <SimulateControl />
      </Grid>
    </Grid>
  );
}
