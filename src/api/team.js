import request from '@/utils/request'

export function getTeamList(data) {
  return request({
    url: '/team/teamListByPage',
    method: 'post',
    data
  })
}

export function getTeamListByPage(data) {
  return request({
    url: '/team/getTeamListByPage',
    method: 'post',
    data
  })
}