import request from '@/utils/request';

export function getLogs() {
  return request({
    url: '/exceptions',
    method: 'get',
  });
}
