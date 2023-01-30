import React, { useCallback } from 'react';
import { Button } from '@strapi/design-system'
import { File } from '@strapi/icons';
import { useCMEditViewDataManager, useNotification } from '@strapi/helper-plugin';
import { speechmaticsApi } from '../api/speechmaticsApi';

const TranscribeButton = () => {
  const { slug, modifiedData } = useCMEditViewDataManager();
  const toggleNotification = useNotification();

  // only show when we are on a session entity edit
  if(slug !== "api::session.session") return null;

  // handle the transcription of the answers
  const handleStartTranscription = useCallback(async () => {
    try {
      await speechmaticsApi.transcribeSession(modifiedData.id);
      toggleNotification({
        type: 'success',
        message: 'Transcribing successfully started!',
      });
    } catch(e) {
      console.log(e.message);
    }
  }, [])

  return (
    <Button variant='secondary' startIcon={<File />} onClick={handleStartTranscription}>Start transcription</Button>
  )
}

export default TranscribeButton;
