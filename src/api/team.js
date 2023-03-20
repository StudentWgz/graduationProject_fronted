import request from '@/utils/request'

export function getTeamList(data) {
  return request({
    url: '/team/teamListByPage',
    method: 'post',
    data
  })
}