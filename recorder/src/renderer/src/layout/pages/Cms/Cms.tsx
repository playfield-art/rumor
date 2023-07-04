import React from "react";
import Grid from "@mui/material/Grid";
import CmsActionsSection from "./CmsActionsSection";

export function Cms() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <CmsActionsSection />
      </Grid>
    </Grid>
  );
}
