import request from '@/utils/request';

export function updatePatientApi(patient_id, data) {
  return request({
    url: `${process.env.REACT_APP_REQUEST_BASE_URL}/doctor/patient/${patient_id}`,
    method: 'put',
    data,
  });
}
export function addPatientApi(data) {
  return request({
    url: `${process.env.REACT_APP_REQUEST_BASE_URL}/doctor/patient`,
    method: 'post',
    data,
  });
}
export function deletePatientApi(patient_id) {
  return request({
    url: `${process.env.REACT_APP_REQUEST_BASE_URL}/doctor/patient/${patient_id}`,
    method: 'delete',
  });
}
