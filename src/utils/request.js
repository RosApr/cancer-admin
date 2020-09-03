import Axios from 'axios';
import { getTokenFromCookie } from './cookie';
import { SPECIAL_REQUEST_URL } from './consts';
import globalLoading from '@/components/globalLoading';

const globalLoadingInstance = globalLoading();
const CancelToken = Axios.CancelToken;
const service = Axios.create({
  baseUrl: process.env.REACT_APP_REQUEST_BASE_URL,
  timeout: 10000,
});
service.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded; charset=UTF-8';
service.interceptors.request.use(
  config => {
    const token = getTokenFromCookie();
    if (token) {
      config.headers['Authorization'] = token;
    }
    config.cancelToken = new CancelToken(function(c) {
      window.cancelRequest = c;
    });
    globalLoadingInstance.show();
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
service.interceptors.response.use(
  response => {
    const { status, data } = response;
    globalLoadingInstance.hide();
    if (status === 401) {
      // no permession to access -> navigate to login page
      window.location.href = '/login';
    }
    if (status === 200) {
      return Promise.resolve(data);
    } else {
      return Promise.reject(data);
    }
  },
  error => {
    globalLoadingInstance.hide();
    if (Axios.isCancel(error)) {
      return Promise.reject({ msg: 'cancel request' });
    }
    const {
      response: { status, data },
    } = error;
    // need optimize
    if (status === 403) {
      // todo
      window.location.href = window.location.origin + '/#/403';
    }
    if (status === 404) {
      // todo
      window.location.href = window.location.origin + '/#/404';
    }
    if (status === 500) {
      window.location.href = window.location.origin + '/#/500';
    }
    return Promise.reject(data);
  }
);

export default params => {
  return service({
    ...params,
  });
};
