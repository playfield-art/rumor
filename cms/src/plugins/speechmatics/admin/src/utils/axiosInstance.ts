/**
 * axios with a custom config.
 */

import axios, { RawAxiosRequestConfig, AxiosRequestHeaders, AxiosHeaders } from 'axios';
import { auth, wrapAxiosInstance } from '@strapi/helper-plugin';

const instance = axios.create({
  baseURL: process.env.STRAPI_ADMIN_BACKEND_URL,
});



instance.interceptors.request.use(
  async (config) => {
    // create the headers
    const headers: AxiosRequestHeaders = new AxiosHeaders();
    headers.Authorization = `Bearer ${auth.getToken()}`;
    headers.Accept =  'application/json';
    headers['Content-Type'] = 'application/json';

    // return the config
    return { ...config, headers };
  },
  (error) => {
    Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // whatever you want to do with the error
    if (error.response?.status === 401) {
      auth.clearAppStorage();
      window.location.reload();
    }

    throw error;
  }
);

const wrapper = wrapAxiosInstance(instance);

export default wrapper;
