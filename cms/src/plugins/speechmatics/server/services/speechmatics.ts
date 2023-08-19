import { Strapi } from '@strapi/strapi';
import FormData from 'form-data';
import axios from "axios";
import { getCoreStore, getService } from '../utils';
import fs from 'fs';
const { Translate } = require('@google-cloud/translate').v2;

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

const getBrainjarUrl = () => {
  return 'https://brj-intern-playfield-rumour.ew.r.appspot.com/';
}

/**
 * A hardcoded list of sessions
 * This will be rewritten with data coming form our database
 * @returns
 */
const getHardcodedSessionsRequestData = () => {
  const sessionsRequestData = [{
    title: "Family, the elderly & community life",
    tags: ["familie", "ouderen", "buurtleven"]
  }, {
    title: "Living & housing",
    tags: ["wonen", "huisvesting"]
  }, {
    title: "Child care, education & work",
    tags: ["kinderzorg", "educatie", "werken"]
  }, {
    title: "Transport & urban design",
    tags: ["transport", "ruimtelijke_ordening"]
  }, {
    title: "Climate, nature & environment",
    tags: ["klimaat", "natuur", "milieu"]
  }, {
    title: "City government & citizens' initiatives",
    tags: ["stadsbestuur", "burgerinitiatieven"]
  }, {
    title: "Arts & culture",
    tags: ["kunst", "cultuur"]
  }, {
    title: "Social security & integration",
    tags: ["sociaal_vangnet", "integratie", "huisvesting"]
  }, {
    title: "Shopping, eating & relaxing",
    tags: ["winkelen", "eten", "ontspanning"]
  }, {
    title: "Technology",
    tags: ["technologie"]
  }]

  return sessionsRequestData.map((sessionRequestData) => ({
    ...sessionRequestData,
    tags: sessionRequestData.tags.map((tag) => ({
      tag,
      "length": 700
    })),
    summary: {}
  }));
}

export default ({ strapi }: { strapi: Strapi }) => ({
  /**
   * Adds the text from a job to an answer in the database
   * @param jobId
   */
  addTextToAnswerViaJobId: async(text: string, jobId: string) => {
    await strapi.db
      .connection('public.components_answers_anwsers')
      .where('speechmatics_job_id', '=', jobId)
      .update({
        original_transcript: text,
        moderated_transcript: text,
        speechmatics_job_id: '',
        transcribed: true
      });
  },

  /**
   * Get not transcribed answers
   * @param limit
   */
  cronUntranscribedAnswers: async(limit: number = 20) => {
    // gets untranscribed answers (limit by incoming parameter)
    const data = await strapi.db.connection.raw(
      `SELECT i.id as answerid, s.id as sessionid, f.url, s."language"
       FROM components_answers_anwsers AS i
       JOIN files_related_morphs AS frm ON frm.related_id = i.id
       JOIN files AS f ON frm.file_id = f.id
       JOIN sessions_components AS sc ON sc.component_id = i.id
       JOIN sessions AS s ON s.id = sc.entity_id
       WHERE transcribed = FALSE AND related_type = 'answers.anwser'
       LIMIT ${limit}`
    );

    // validate
    if(!data.rows && data.rows.length <= 0) return;

    // answers to transcribe
    const answersToTranscribePromises = data.rows.map(async(row) => {
      // start a speecmatics job
      const jobId = await getService('speechmatics').startSpeechmaticsJob(
        row.language,
        row.url
      );

      // update answer with the job id
      if(jobId) {
        await getService('speechmatics').addSpeechmaticsJobIdToAnswer(jobId, row.answerid);
      }
    });

    // wait until all answers ran a speechmatics job
    await Promise.all(answersToTranscribePromises);
  },

  /**
   * The answer id to add a job to
   * @param answerId
   */
  addSpeechmaticsJobIdToAnswer: async (jobId: string, answerId: string) => {
    await strapi.db
      .connection('public.components_answers_anwsers')
      .where('id', '=', answerId)
      .update({
        speechmatics_job_id: jobId
      });
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
   * Get the training state
   */
  getTrainingState: async() => {
     // get the plugin settings
    let config = await getCoreStore().get({ key: 'settings' });

    // validate
    if(!config || !config.brainjarApiKey) return;

    // get the token
    const brainjarApiKey = config.brainjarApiKey;

    // do the post
    try {
      // create a function that will sync our data with data in brainjar database
      const getStatus = () => new Promise<string>((resolve, reject) => {
        axios.get(
          `${getBrainjarUrl()}rumor`,
          {
            headers: {
              'Authorization': `Bearer ${brainjarApiKey}`,
              'Accept': "application/json"
            }
          }
        ).then((response) => {
          resolve(response.data.status)
        });
      });
      return await getStatus();
    } catch(err) {
      console.log(err.response.data);
      console.log(err.response.status);
      console.log(err.response.headers);
      console.log(err.message);
    }
  },

  /**
   * Starts a Speechmatics job
   */
  startSpeechmaticsJob: async (language: string, audioUrl: string): Promise<string> => {
    // get the plugin settings
    let config = await getCoreStore().get({ key: 'settings' });

    // validate
    if(!config || !config.speechmaticsApiToken) return;

    // get the token
    const token = config.speechmaticsApiToken;

    // get the notification url
    const notifyCallbackUrl = config?.notifyCallbackUrl || "";

    // get the speechmatics URL
    const speechmaticsUrl = getSpeechmaticsUrl();

    // get the speechmatics configuration
    const speechmaticsConfig = getSpeechmaticsConfig(
      language,
      audioUrl,
      notifyCallbackUrl
    );

    // create the form data
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
    if(data && data.id) return data.id

    // return empty string if no job id was created
    return null;
  },

  /**
   * Start training the AI
   * @returns
   */
  startTraining: async() => {
    // get the plugin settings
    let config = await getCoreStore().get({ key: 'settings' });

    // validate
    if(!config || !config.brainjarApiKey || !config.iterationIntro || !config.iterationOutro) return;

    // get the token
    const brainjarApiKey = config.brainjarApiKey;

    // create the json data
    const jsondata = {
      intro: config.iterationIntro,
      sections: getHardcodedSessionsRequestData(),
      outro: config.iterationOutro,
    }

    // do the post
    try {
      // create a function that will sync our data with data in brainjar database
      const refreshData = () => new Promise<void>((resolve, reject) => {
        axios.get(
          `${getBrainjarUrl()}input/refresh`,
          {
            headers: {
              'Authorization': `Bearer ${brainjarApiKey}`,
              'Accept': "application/json"
            }
          }
        ).then(() => {
          console.log('Data was refreshed in the Brainjar database!');
          resolve()
        });
      });

      // create a function that will start the training
      const startGeneration = () => new Promise<void>((resolve, reject) => {
        axios.post(
          `${getBrainjarUrl()}rumor/generate`,
          jsondata,
          {
            params: {
              callback_url: "https://rumor-cms.playfield.be"
            },
            headers: {
              'Authorization': `Bearer ${brainjarApiKey}`,
              'Accept': "application/json"
            }
          }
        ).then(() => resolve());
        console.log('Learning iteration started!');
      });

      // do the work chain
      refreshData().then(() => { startGeneration() });
    } catch(err) {
      console.log(err.response.data);
      console.log(err.response.status);
      console.log(err.response.headers);
      console.log(err.message);
    }
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

    // answers to transcribe
    const answersToTranscribePromises = answersToTranscribe.map(async(answer) => {
      // start a speecmatics job
      const jobId = await getService('speechmatics').startSpeechmaticsJob(
        session.language,
        answer.audio.url
      );

      // update answer with the job id
      if(jobId) {
        await getService('speechmatics').addSpeechmaticsJobIdToAnswer(jobId, answer.id);
      }
    });

    // wait until all answers ran a speechmatics job
    await Promise.all(answersToTranscribePromises);
  },

  /**
   * Translates the moderated texts in of a session
   * @param sessionId The ID of the session to translate
   */
  translateSession: async(sessionId: number) => {
    // get the session
    const session = await strapi.entityService.findOne('api::session.session', sessionId, {
      populate: ["answers"]
    });

    // validate
    if(!session || !session.answers || session.answers.length <= 0) return;

     // get the answers to translate
    const answersToTranslate = session.answers.filter((answer) => {
      return (answer.moderated_transcript && answer.moderated_transcript !== "")
    });

    // validate
    if(answersToTranslate.length <= 0) return;

    // start translating the moderated answers
    let config = await getCoreStore().get({ key: 'settings' });

    // validate
    if(!config || !config.googleTranslateApiToken || !config.googleCloudProjectId) return;

    // instantiates a client
    const translate = new Translate({
      key: config.googleTranslateApiToken,
      projectId: config.googleCloudProjectId
    });

    // answers to transcribe
    const answersToTranslatePromises = answersToTranslate.map(async(answer) => {
      const [translation] = await translate.translate(answer.moderated_transcript, config.targetLanguage || "en");
      answer.common_language = translation;
    });

    // translate the moderated text of answers
    await Promise.all(answersToTranslatePromises);

    // update the session with translations
    await strapi.entityService.update('api::session.session', sessionId, {
      populate: ["answers"],
      data: {
        ...session
      },
    });
  }
});
