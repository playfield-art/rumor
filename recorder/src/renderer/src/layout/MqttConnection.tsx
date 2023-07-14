import { useMqtt } from "@hooks/useMqtt";
import React from "react";
import LensIcon from "@mui/icons-material/Lens";
import { Stack, Typography } from "@mui/material";

export function MqttConnection() {
  const { currentMqttConnection } = useMqtt();

  return (
    <>
      {!currentMqttConnection && (
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          spacing={1}
        >
          <LensIcon sx={{ color: "var(--red-600)" }} />
          <Typography>MQTT not connected</Typography>
        </Stack>
      )}
      {currentMqttConnection && (
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          spacing={1}
        >
          <LensIcon sx={{ color: "var(--green)" }} />
          <Typography>MQTT connected!</Typography>
        </Stack>
      )}
    </>
  );
}
