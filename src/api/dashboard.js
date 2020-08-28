import request from '@/utils/request';

export function fetchArticles() {
  return request({
    url: '/dashboard/fetch',
    method: 'get',
  });
}
export function syncDoctorSchedules() {
  return request({
    url: '/dashboard/syncDoctorSchedules',
    method: 'get',
  });
}
