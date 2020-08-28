import request from '@/utils/request';

export function getServices(params) {
  return request({
    url: '/cate',
    method: 'get',
    params,
  });
}

export function getService(id) {
  return request({
    url: `/cate/${id}`,
    method: 'get',
  });
}

export function save(form) {
  return request({
    url: '/cate',
    method: 'post',
    data: form,
  });
}
