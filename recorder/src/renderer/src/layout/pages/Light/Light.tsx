import React from "react";
import { Grid } from "@mui/material";
import { ChannelsSection } from "./ChannelsSection";
import { FunctionsSection } from "./FunctionsSection";

export function Light() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4} lg={3} xl={2}>
        <FunctionsSection />
      </Grid>
      <Grid item xs={12} md={8} lg={9} xl={10}>
        <ChannelsSection />
      </Grid>
    </Grid>
  );
}
