import request from '@/utils/request';

export function fetchProjectListApi(data = {}) {
  return request({
    url: `${process.env.REACT_APP_REQUEST_BASE_URL}/project/search`,
    method: 'post',
    data,
  });
}
