import { getApiURL, axiosInstance } from "../utils";

/**
 * Export settings helpers
 */
export const settingsApi = {
  /**
  * Get Speechmatics settings from Strapi
  * @returns
  */
  getSettings: async () => {
    try {
      const { data } = await axiosInstance.get(getApiURL('settings'));
      return data;
    } catch (err) {
      console.log(err.message);
    }
  },

  /**
  * Set Speechmatics vis Strapi
  * @param data
  * @returns
  */
  setSettings: async (data) => {
    try {
      return await axiosInstance.post('/speechmatics/settings', data);
    } catch (err) {
      console.log(err.message);
    }
  }
}
