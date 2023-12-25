import axios from 'axios';
import _ from 'lodash';
import config from './config';

const TIMEOUT = 50000;

const instance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  withCredentials: true,
  timeout: TIMEOUT,
});

instance.interceptors.response.use(
  (response) => {
    // Thrown error for request with OK status code
    const { data } = response;
    return data;
  },
  (error) => {
    if (error.response) {
      return Promise.reject(error.response.data);
    }
    Promise.reject(error);
  }
);

export default instance;
