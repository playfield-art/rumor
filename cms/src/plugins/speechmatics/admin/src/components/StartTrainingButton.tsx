import React, { useCallback, useState, useEffect } from 'react';
import { Button, Stack, Typography } from '@strapi/design-system'
import { useCMEditViewDataManager, useNotification } from '@strapi/helper-plugin';
import { speechmaticsApi } from '../api/speechmaticsApi';

const StartTrainingButton = () => {
  const [ stateMessage, setStateMessage ] = useState("Loading state...");
  const toggleNotification = useNotification();

  // only show when we are on a session entity edit
  // check if in window.location is the string "api::session.session"
  if(!window.location.pathname.includes("api::session.session"))
    return null

  // handle the transcription of the answers
  const handleStartTraining = useCallback(async () => {
    try {
      await speechmaticsApi.startTraining();
      toggleNotification({
        type: 'success',
        message: 'Gave a start training trigger to Brainjar!',
      });
    } catch(e) {
      console.log(e.message);
    }
  }, [])

  // when the components mounts
  useEffect(() => {
    speechmaticsApi.isTraining().then((state) => setStateMessage(state ? "Rumor is currently learning..." : ""));
  }, []);

  return (
    <Stack direction="row" alignItems="center" gap={4}>
      <Typography variant='h4'>{stateMessage}</Typography>
      <Button variant='primary' onClick={handleStartTraining}>Start training Rumor</Button>
    </Stack>
  )
}

export default StartTrainingButton;
