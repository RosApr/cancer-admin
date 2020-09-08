import request from '@/utils/request';

export function fetchDoctorListApi(params) {
  return request({
    url: `${process.env.REACT_APP_REQUEST_BASE_URL}/doctor`,
    method: 'get',
    params,
  });
}
