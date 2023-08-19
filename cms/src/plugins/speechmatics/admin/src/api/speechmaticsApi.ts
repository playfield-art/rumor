import { getApiURL, axiosInstance } from "../utils";

/**
 * Export speechmatics helpers
 */
export const speechmaticsApi = {
  /**
   * Start training the AI
   */
  startTraining: async () => {
    try {
      await axiosInstance.post(getApiURL('startTraining'), {});
    } catch (err) {
      console.log(err.message);
    }
  },

  /**
   * Check if the AI is training
   */
  isTraining: async (): Promise<boolean> => {
    try {
      return (await axiosInstance.get(getApiURL('trainingState'), {})).data === 'processing';
    } catch (err) {
      console.log(err.message);
      return false;
    }
  },

 /**
  * Transcribe a session
  * @returns
  */
  transcribeSession: async (sessionId: number) => {
    try {
      await axiosInstance.post(getApiURL('transcribeSession'), { sessionId });
    } catch (err) {
      console.log(err.message);
    }
  },

  /**
   * Translate moderated texts in a session
   */
  translateSession: async (sessionId: number) => {
    try {
      await axiosInstance.post(getApiURL('translateSession'), { sessionId });
    } catch (err) {
      console.log(err.message);
    }
  }
}
