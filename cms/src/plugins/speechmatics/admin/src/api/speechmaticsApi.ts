import { getApiURL, axiosInstance } from "../utils";

/**
 * Export speechmatics helpers
 */
export const speechmaticsApi = {
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
  }
}
