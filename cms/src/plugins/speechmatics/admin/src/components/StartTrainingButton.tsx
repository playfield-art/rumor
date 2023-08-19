import React, { useCallback, useState, useEffect } from 'react';
import { Flex, Button, Stack, Typography, Dialog, DialogBody, DialogFooter } from '@strapi/design-system'
import { useNotification } from '@strapi/helper-plugin';
import { ExclamationMarkCircle, Trash } from '@strapi/icons';
import { speechmaticsApi } from '../api/speechmaticsApi';

const StartTrainingButton = () => {
  const [ stateMessage, setStateMessage ] = useState("Loading state...");
  const [ dialogIsVisible, setDialogIsVisible ] = useState(false);
  const toggleNotification = useNotification();

  // only show when we are on a session entity edit
  // check if in window.location is the string "api::session.session"
  if(!window.location.pathname.includes("api::session.session"))
    return null

  // handle the transcription of the answers
  const handleStartTraining = useCallback(async () => {
  console.log('test')
    try {
      await speechmaticsApi.startTraining();
      toggleNotification({
        type: 'success',
        message: 'Rumor started learning the data!',
      });
    } catch(e) {
      console.log(e.message);
    }
  }, [])

  // define a sync state message function
  const syncStateMessage = () => {
    speechmaticsApi.isTraining().then((state) => setStateMessage(state ? "Rumor is currently learning..." : ""));
  }

  // when the components mounts
  useEffect(() => {
    // start the first sync
    syncStateMessage();

    // do on interval
    const interval = setInterval(syncStateMessage, 3000);

    // clear the interval when unmounting
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Stack direction="row" alignItems="center" gap={4}>
        <Typography variant='h4'>{stateMessage}</Typography>
        <Button variant='primary' onClick={() => setDialogIsVisible(true)}>Start training Rumor</Button>
      </Stack>
      <Dialog onClose={() => setDialogIsVisible(false)} title="Be Careful!" isOpen={dialogIsVisible}>
        <DialogBody icon={<ExclamationMarkCircle />}>
          <Flex direction="column" alignItems="center" gap={2}>
            <Flex justifyContent="center">
              <Typography id="confirm-description">This action costs MONEY!! Are you sure?</Typography>
            </Flex>
          </Flex>
        </DialogBody>
        <DialogFooter startAction={<Button onClick={() => setDialogIsVisible(false)} variant="tertiary">
          Cancel
          </Button>} endAction={<Button variant="danger-light" onClick={handleStartTraining}>
            Confirm
          </Button>} />
      </Dialog>
    </>
  )
}

export default StartTrainingButton;
