import request from '@/utils/request';

export function fetchCancersApi(params = {}) {
  return request({
    url: `${process.env.REACT_APP_REQUEST_BASE_URL}/cancer`,
    method: 'get',
    params,
  });
}

export function addCancerApi(data = {}) {
  return request({
    url: `${process.env.REACT_APP_REQUEST_BASE_URL}/cancer`,
    method: 'post',
    data,
  });
}

export function fetchCancerDetailApi(cancer_id = '') {
  return request({
    url: `${process.env.REACT_APP_REQUEST_BASE_URL}/cancer/${cancer_id}`,
    method: 'get',
  });
}

export function updateCancerApi(cancer_id, data = {}) {
  return request({
    url: `${process.env.REACT_APP_REQUEST_BASE_URL}/cancer/${cancer_id}`,
    method: 'put',
    data,
  });
}

export function delCancerApi(cancer_id = '') {
  return request({
    url: `${process.env.REACT_APP_REQUEST_BASE_URL}/cancer/${cancer_id}`,
    method: 'delete',
  });
}
