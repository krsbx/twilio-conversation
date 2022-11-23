import axios from 'axios';
import cookieUtils from '../utils/cookieUtils';

const instance = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_API_URL,
});

export const applyInterceptors = () => {
  instance.interceptors.request.use(
    (config) => {
      const token = cookieUtils.getToken() || ''; // or anywhere that you store the token

      if (config.headers) {
        config.headers.Authorization = token ? `Bearer ${token}` : '';
      }

      return config;
    },
    (err: any) => Promise.reject(err)
  );

  // set the resource in the redux store on response
  instance.interceptors.response.use((res) => {
    return res;
  });
};

export default instance;
