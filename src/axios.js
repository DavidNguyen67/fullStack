import axios from 'axios';
import _ from 'lodash';
import config from './config';
import axiosRetry from 'axios-retry';

const TIMEOUT = 50000;

const instance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  withCredentials: true,
  timeout: TIMEOUT,
  // headers: {
  //   'Contetnt-Type': 'multipart/form-data',
  // },
});

axiosRetry(instance, {
  retries: 3, // number of retries
  retryDelay: (retryCount) => {
    console.log(`retry attempt: ${retryCount}`);
    return retryCount * 2000; // time interval between retries
  },
  retryCondition: (error) => {
    // if retry condition is not specified, by default idempotent requests are retried
    return error.response.status === 503;
  },
});

instance.interceptors.response.use(
  (response) => {
    // Thrown error for request with OK status code
    const { data } = response;
    return data;
  },
  (error) => {
    if (error.response) {
      // return Promise.reject(error.response.data);
      const { ...response } = error.response;
      return response;
    }
    // Promise.reject(error);
    return error;
  }
);

export default instance;
