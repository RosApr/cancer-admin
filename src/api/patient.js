import request from '@/utils/request';

export function getPatientList(params) {
  return request({
    url: '/patient/list',
    method: 'get',
    params,
  });
}
