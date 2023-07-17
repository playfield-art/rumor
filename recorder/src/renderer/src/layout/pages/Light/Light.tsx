import React from "react";
import { Grid } from "@mui/material";
import { ChannelsSection } from "./ChannelsSection";
import { FunctionsSection } from "./FunctionsSection";

export function Light() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={3}>
        <FunctionsSection />
      </Grid>
      <Grid item xs={12} md={9}>
        <ChannelsSection />
      </Grid>
    </Grid>
  );
}
