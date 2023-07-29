/* eslint-disable react/require-default-props */
import {
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { StoryLineChapterOption } from "@shared/interfaces";
import React, { useEffect } from "react";

export interface StoryLineChapterProps {
  chapter: string;
  storyLineChapterOptions: StoryLineChapterOption[];
  onStoryLineChapterOptionChange: (
    option: StoryLineChapterOption | null
  ) => void;
}

export function StoryLineChapter({
  chapter,
  storyLineChapterOptions = [],
  onStoryLineChapterOptionChange,
}: StoryLineChapterProps) {
  // set the current chapter option
  const [currentChapterOptionId, setCurrentChapterOptionId] =
    React.useState<string>("random");

  useEffect(() => {
    window.rumor.methods.getSelectedChapterOptionId(chapter).then((option) => {
      setCurrentChapterOptionId(option);
    });
  }, []);

  return (
    <Stack direction="column" spacing={2}>
      <Typography variant="h6">{chapter}</Typography>
      <ToggleButtonGroup
        orientation="vertical"
        value={currentChapterOptionId ?? storyLineChapterOptions[0].id}
        exclusive
        onChange={(e, value) => {
          // get the selected option
          const selectedStoryLineChapterOption = storyLineChapterOptions.find(
            (option) => option.id === value
          );

          // set the current chapter option
          if (selectedStoryLineChapterOption) {
            setCurrentChapterOptionId(selectedStoryLineChapterOption.id);
            if (value && onStoryLineChapterOptionChange) {
              onStoryLineChapterOptionChange(selectedStoryLineChapterOption);
            }
          }
        }}
      >
        {storyLineChapterOptions &&
          storyLineChapterOptions.map(({ title, id }) => (
            <ToggleButton key={id} value={id}>
              <Typography>{title}</Typography>
            </ToggleButton>
          ))}
      </ToggleButtonGroup>
    </Stack>
  );
}
