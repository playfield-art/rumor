import { useDoor } from "@hooks/useDoor";
import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import SensorDoorIcon from "@mui/icons-material/SensorDoor";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import BatteryStdIcon from "@mui/icons-material/BatteryStd";

export function DoorState() {
  const { currentDoorState } = useDoor();

  return (
    <Box sx={{ color: "var(--grey-1000)" }}>
      <Stack direction="row" spacing={2}>
        {/* Door is {currentDoorState.open ? "open" : "closed"} */}
        {currentDoorState.open ? <MeetingRoomIcon /> : <SensorDoorIcon />}
        <Stack direction="row" spacing={0}>
          <BatteryStdIcon />
          <Typography>{currentDoorState.battery}%</Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
