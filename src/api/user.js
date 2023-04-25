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
  console.log(11,data);
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
// 获取在线用户
export function getAllUsers() {
  return request({
    url: '/user/getFriendShipOfInline',
    method: 'post',
  })
}
// 获取聊天历史消息
export function getChatRecord(id) {
  return request({
    url: '/im/getChatRecordById',
    method: 'get',
    params: { friendId: id }
  })
}
// 添加好友
export function addFriendShip(id) {
  return request({
    url: '/user/addFriendShip',
    method: 'post',
    params: { friendId: id }
  })
}
