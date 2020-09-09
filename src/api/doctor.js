import request from '@/utils/request';

export function fetchDoctorListApi(params) {
  return request({
    url: `${process.env.REACT_APP_REQUEST_BASE_URL}/doctor`,
    method: 'get',
    params,
  });
}

export function fetchDoctorDetailApi(doctorId) {
  return request({
    url: `${process.env.REACT_APP_REQUEST_BASE_URL}/doctor/${doctorId}`,
    method: 'get',
  });
}
