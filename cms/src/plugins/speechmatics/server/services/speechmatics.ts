import { Strapi } from '@strapi/strapi';
import FormData from 'form-data';
import axios from "axios";
import { getCoreStore } from '../utils';

const getSpeechmaticsConfig = (language: string, url: string, notifyCallbackUrl: string = "") => {
  const config = {
    "type": "transcription",
    "transcription_config": {
      "operating_point":"enhanced",
      "language": language
    },
    "fetch_data": {
      "url": url
    }
  }

  if(notifyCallbackUrl) {
    return {
      ...config,
      "notification_config": [
        {
          "url": notifyCallbackUrl
        }
      ]
    }
  }

  return config;
};

const getSpeechmaticsUrl = () => {
  return 'https://asr.api.speechmatics.com/v2/jobs/';
}

export default ({ strapi }: { strapi: Strapi }) => ({
  /**
   * Adds the text from a job to an answer
   * @param jobId
   */
  addTextToAnswerViaJobId: async(text: string, jobId: string) => {
    const data = await strapi.db.connection.raw(`
      UPDATE public.components_answers_anwsers
      SET original_transcript='${text}', moderated_transcript='${text}', speechmatics_job_id = '', transcribed = true
      WHERE speechmatics_job_id = '${jobId}'
    `);
  },

  /**
   * Gets the text, coming from a Speechmatics job
   * @param jobId
   */
  getTextFromJob: async (jobId: string) => {
     // start jobs at speechmatics
    let config = await getCoreStore().get({ key: 'settings' });

    // validate
    if(!config || !config.speechmaticsApiToken) return;

    // get the token
    const token = config.speechmaticsApiToken;

    // create form data
    const formData = new FormData();

    // do the post
    const { data } = await axios.post(
      `${getSpeechmaticsUrl()}/${jobId}/transcript?format=txt`,
      formData.getBuffer(),
      {
        headers: {
          ...formData.getHeaders(),
          'Authorization': `Bearer ${token}`
        }
      }
    );

    // return the text
    return data;
  },

  /**
   * Transcibes a session (starts job at speechmatics)
   * @param sessionId The ID of the session
   * @returns
   */
  transcribeSession: async (sessionId: number) => {
    // get the session
    const session = await strapi.entityService.findOne('api::session.session', sessionId, {
      populate: ["answers", "answers.audio"]
    });

    // validate
    if(!session || !session.answers || session.answers.length <= 0) return;

    // get the answers to transcribe
    const answersToTranscribe = session.answers.filter((answer) => {
      return (answer.transcribed === false) && (answer.audio?.url)
    });

    // validate
    if(answersToTranscribe.length <= 0) return;

    // start jobs at speechmatics
    let config = await getCoreStore().get({ key: 'settings' });

    // validate
    if(!config || !config.speechmaticsApiToken) return;

    // get the token
    const token = config.speechmaticsApiToken;

    // get the notification url
    const notifyCallbackUrl = config?.notifyCallbackUrl || "";

    // get the speechmatics URL
    const speechmaticsUrl = getSpeechmaticsUrl();

    // answers to transcribe
    const answersToTranscribePromises = answersToTranscribe.map(async(answer) => {
      const speechmaticsConfig = getSpeechmaticsConfig(
        session.language,
        answer.audio.url,
        notifyCallbackUrl
      )

      const formData = new FormData();
      formData.append(
        'config',
        JSON.stringify(speechmaticsConfig)
      );

      // do the post
      const { data } = await axios.post(
        speechmaticsUrl,
        formData.getBuffer(),
        {
          headers: {
            ...formData.getHeaders(),
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // update answer with the job id
      if(data && data.id) { answer.speechmatics_job_id = data.id; }
    });

    // wait until all answers ran a speechmatics job
    await Promise.all(answersToTranscribePromises);

    // update the session
    const updatedSession = await strapi.entityService.update('api::session.session', sessionId, {
      data: {
        answers: [...session.answers]
      },
      populate: ['answers']
    });

    // return the updated session
    return updatedSession;
  }
});
