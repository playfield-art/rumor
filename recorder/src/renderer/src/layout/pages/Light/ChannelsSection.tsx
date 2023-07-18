import { Section } from "@components/layout/Section";
import { useLightStore } from "@hooks/useLightStore";
import { Box, Slider, Stack } from "@mui/material";
import React from "react";

export function ChannelsSection() {
  const red = useLightStore((state) => state.red);
  const green = useLightStore((state) => state.green);
  const blue = useLightStore((state) => state.blue);
  const white = useLightStore((state) => state.white);
  const updateChannel = useLightStore((state) => state.updateChannel);

  const handleChange = (event: any, newValue: number | number[]) => {
    const channelName = event.target.name;
    const value = newValue as number;
    updateChannel(channelName, value);
    window.rumor.actions.light.setColor(channelName, value);
  };

  return (
    <Section title="Channels">
      <Stack spacing={5} direction="row" sx={{ mb: 2 }} alignItems="center">
        <Box sx={{ width: 100 }}>Red</Box>
        <Slider
          aria-label="Red"
          name="red"
          value={red}
          onChange={handleChange}
          min={0}
          max={255}
        />
        <Box>{red}</Box>
      </Stack>
      <Stack spacing={5} direction="row" sx={{ mb: 2 }} alignItems="center">
        <Box sx={{ width: 100 }}>Green</Box>
        <Slider
          aria-label="Green"
          name="green"
          value={green}
          onChange={handleChange}
          min={0}
          max={255}
        />
        <Box>{green}</Box>
      </Stack>
      <Stack spacing={5} direction="row" sx={{ mb: 2 }} alignItems="center">
        <Box sx={{ width: 100 }}>Blue</Box>
        <Slider
          aria-label="Blue"
          name="blue"
          value={blue}
          onChange={handleChange}
          min={0}
          max={255}
        />
        <Box>{blue}</Box>
      </Stack>
      <Stack spacing={5} direction="row" sx={{ mb: 2 }} alignItems="center">
        <Box sx={{ width: 100 }}>White</Box>
        <Slider
          aria-label="White"
          name="white"
          value={white}
          onChange={handleChange}
          min={0}
          max={255}
        />
        <Box>{white}</Box>
      </Stack>
    </Section>
  );
}
