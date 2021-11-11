/* eslint-disable no-param-reassign */
import axios from 'axios';

const UNAUTHORIZED = 401;

const ax = axios.create();
ax.interceptors.request.use(
  async (config) => {
    config.headers['Access-Control-Allow-Origin'] = '*';
    config.headers['Access-Control-Allow-Headers'] = '*';

    return config;
  },
  (error) => Promise.reject(error)
);

ax.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { status } = error.response;

    if (status === UNAUTHORIZED) {
      return Promise.resolve();
    }

    return Promise.reject(error);
  }
);

export default ax;
