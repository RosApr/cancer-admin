import request from '@/utils/request';

export function login(data) {
  return request({
    url: `${process.env.REACT_APP_REQUEST_BASE_URL}/backend/login`,
    method: 'post',
    data,
  });
}

// export function getUser(id) {
//   return request({
//     url: '/user',
//     method: 'get',
//     params: { id },
//   });
// }

// export function logout() {
//   return request({
//     url: '/user/logout',
//     method: 'post',
//   });
// }

// export function getUserList() {
//   return request({
//     url: '/user/list',
//     method: 'get',
//   });
// }

// export function saveUser(data) {
//   return request({
//     url: '/user/',
//     method: 'post',
//     data,
//   });
// }
