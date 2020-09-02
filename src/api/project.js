import request from '@/utils/request';

export function fetchProjectListApi(data = {}) {
  return request({
    url: `${process.env.REACT_APP_REQUEST_BASE_URL}/project/search`,
    method: 'post',
    data,
  });
}

export function fetchProjectDetailApi({ cancer_id = '', project_id = '' }) {
  return request({
    url: `${process.env.REACT_APP_REQUEST_BASE_URL}/cancer/${cancer_id}/project/${project_id}`,
    method: 'get',
  });
}

export function updateProjectCheckApi(project_id, data = {}) {
  return request({
    url: `${process.env.REACT_APP_REQUEST_BASE_URL}/project/checkCriterion/${project_id}`,
    method: 'put',
    data,
  });
}

export function updateProjectConfigApi(project_id, data = {}) {
  return request({
    url: `${process.env.REACT_APP_REQUEST_BASE_URL}/project/${project_id}`,
    method: 'put',
    data,
  });
}
