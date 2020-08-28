import request from '@/utils/request';
import { SPECIAL_REQUEST_URL } from '@/utils/consts';
export function getDoctorList(params) {
  return request({
    url: '/doctor/list',
    method: 'get',
    params,
  });
}

export function syncDoctor() {
  return request({
    url: '/doctor/sync',
    method: 'post',
  });
}

export function getDoctorList0(officeId = 12) {
  const data = {
    isWorkingOffice: true,
    isInactive: false,
    includeLeft: false,
    selectedOfficeId: officeId,
    roleName: null,
    selectedItem: null,
    page: 4,
    job: '医生',
    workingOfficeId: officeId,
    hasAccount: null,
    isShow: true,
    withWorkOffices: true,
    withUserInfo: true,
  };
  return request({
    url: `${SPECIAL_REQUEST_URL}/v1/providers`,
    method: 'post',
    data,
  });
}

export function getDoctor(id) {
  const params = { id };
  return request({
    url: '/doctor',
    method: 'get',
    params,
  });
}

export function saveDoctor(doc) {
  return request({
    url: '/doctor',
    method: 'post',
    data: doc,
  });
}

export function deleteDoctor(id) {
  const params = { id };
  return request({
    url: '/doctor',
    method: 'delete',
    params,
  });
}

export function getDoctorResume(id) {
  const params = { id };
  return request({
    url: '/doctor/resume',
    method: 'get',
    params,
  });
}

export function saveDoctorResume(data) {
  return request({
    url: '/doctor/resume',
    method: 'post',
    data,
  });
}

export function getDoctorSchedule(id) {
  const params = { id };
  return request({
    url: '/doctor/schedule',
    method: 'get',
    params,
  });
}

export function saveDoctorSchedule(data) {
  return request({
    url: '/doctor/schedule',
    method: 'post',
    data,
  });
}
