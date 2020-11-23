import request from '@/utils/request';

export function fetchNewsListApi(params = {}) {
  return request({
    url: `${process.env.REACT_APP_REQUEST_BASE_URL}/news`,
    method: 'get',
    params,
  });
}

export function addNewsApi(data = {}) {
  return request({
    url: `${process.env.REACT_APP_REQUEST_BASE_URL}/news`,
    method: 'post',
    data,
  });
}

export function fetchNewsDetailApi(news_id = '') {
  return request({
    url: `${process.env.REACT_APP_REQUEST_BASE_URL}/news/${news_id}`,
    method: 'get',
  });
}

export function updateNewsApi(news_id, data = {}) {
  return request({
    url: `${process.env.REACT_APP_REQUEST_BASE_URL}/news/${news_id}`,
    method: 'put',
    data,
  });
}

export function delNewsApi(news_id = '') {
  return request({
    url: `${process.env.REACT_APP_REQUEST_BASE_URL}/news/${news_id}`,
    method: 'delete',
  });
}
