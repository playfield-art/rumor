import React from "react";
import { Grid } from "@mui/material";
import { StoryLineChapters } from "./StoryLineChapters";

export function StoryLine() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <StoryLineChapters />
      </Grid>
    </Grid>
  );
}
