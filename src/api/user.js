import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function register(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}

export function showUserById(id) {
  return request({
    url: '/user/info/' + id,
    method: 'get',
  })
}

export function getInfo(data) {
  return request({
    url: '/user/info',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function userListByPage(data) {
  return request({
    url: '/user/userListByPage',
    method: 'post',
    data
  })
}

export function editUser(data) {
  return request({
    url: '/user/editUser',
    method: 'post',
    data
  })
}

export async function getUserListByIdsUsingPOST(data) {
  return request({
    url: '/user/getUserListByIds',
    method: 'POST',
    data
  });
}