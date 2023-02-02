import React, { useCallback } from 'react';
import { Button } from '@strapi/design-system'
import { File } from '@strapi/icons';
import { useCMEditViewDataManager, useNotification } from '@strapi/helper-plugin';
import { speechmaticsApi } from '../api/speechmaticsApi';

const TranslateButton = () => {
  const { slug, modifiedData } = useCMEditViewDataManager();
  const toggleNotification = useNotification();

  // only show when we are on a session entity edit
  if(slug !== "api::session.session") return null;

  // handle the transcription of the answers
  const handleStartTranslation = useCallback(async () => {
    try {
      await speechmaticsApi.translateSession(modifiedData.id);
      toggleNotification({
        type: 'success',
        message: 'Translation successfully done!',
      });
      window.location.reload();
    } catch(e) {
      console.log(e.message);
    }
  }, [])

  return (
    <Button variant='secondary' startIcon={<File />} onClick={handleStartTranslation}>Translate Moderated Texts</Button>
  )
}

export default TranslateButton;
