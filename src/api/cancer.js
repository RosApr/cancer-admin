import request from '@/utils/request';

export function fetchCancersApi() {
  return request({
    url: `${process.env.REACT_APP_REQUEST_BASE_URL}/cancer`,
    method: 'get',
  });
}