import request from '@/utils/request';

export function sync() {
  return request({
    url: '/office/sync',
    method: 'get',
  });
}

export function getOffices() {
  return request({
    url: '/office',
    method: 'get',
  });
}

export function getOffice(id) {
  return request({
    url: `/office/${id}`,
    method: 'get',
  });
}

export function save(form) {
  return request({
    url: '/office',
    method: 'post',
    data: form,
  });
}
