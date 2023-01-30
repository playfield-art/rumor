import React, { useCallback } from 'react';
import { Button } from '@strapi/design-system'
import { File } from '@strapi/icons';
import { useCMEditViewDataManager } from '@strapi/helper-plugin';

const TranscribeButton = () => {
  const { slug, modifiedData } = useCMEditViewDataManager();

  // only show when we are on a session entity edit
  if(slug !== "api::session.session") return null;

  // handle the transcription of the answers
  const handleStartTranscription = useCallback(async () => {
    // const { answers } = modifiedData;
    // const language = modifiedData.language;
    // // if we have answers
    // if(answers && answers.length > 0) {
    //   const jobs = answers.map(async (answer) => {
    //     if(answer?.audio) {
    //       const data = new FormData();
    //       const config = getSpeechmaticsConfig(language, answer.audio?.url);
    //       data.append('config', JSON.stringify(config));
    //       const response = await fetch.post(data);
    //       console.log(response);
    //     }
    //   });
    //   await Promise.all(jobs);
    // }
  }, [])


  return (
    <Button variant='secondary' startIcon={<File />} onClick={handleStartTranscription}>Start transcription</Button>
  )
}

export default TranscribeButton;
