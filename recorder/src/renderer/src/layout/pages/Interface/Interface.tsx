import React from "react";
import Grid from "@mui/material/Grid";
import ChangePageSection from "./ChangePageSection";
import SimulateControl from "./SimulateControl";

export function Interface() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6} lg={4}>
        <ChangePageSection />
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <SimulateControl />
      </Grid>
    </Grid>
  );
}
