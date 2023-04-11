<template>
  <div class="common-layout">
    聊天
  </div>
</template>

<script>
// import { getUserListByIdsUsingPOST } from "@/api/user/getUserListByIdsUsingPOST"
export default {
  name: 'Chat',
  data() {
    return {
      name: 'Chat',
      loginUserList: [],
      loginUserIdList: []
    }
  },
  mounted() {
    this.initWebSocket()
  },
  methods: {
    async addUserLoginList(data) {
      this.loginUserIdList = JSON.parse(data.im.text)
      const res = await getUserListByIdsUsingPOST({
        ids: this.loginUserIdList.value
      });
      loginUserList.value = res.data
    },
    initWebSocket() {
      const client = new WebSocket(`ws://localhost:8088/ws?id=${this.$store.state.user.userId}`)
      client.onopen = () => {
        console.log('open')
      }
      client.onclose = () => {  // 页面刷新的时候和后台websocket服务关闭的时候
        ElMessage.error('服务器断开，请刷新重试');
        console.log('close')
      }

      // 当收到消息
      client.onmessage = (msg) => {
        console.log(msg)
        if (msg.data) {
          // console.log(msg.data)
          let json = JSON.parse(msg.data)
          const messageType = json.type;
          if (messageType === 10003) {
            addUserLoginList(json)
            return;
          }
          // console.log(json)
          if (json.uid && json.text) {  // 聊天消息
            messages.value.push(json)
            console.log(json)
            console.log(messages)
            loginUserList.value.forEach(user => {
              if (user.id === json.uid) {
                user.isNew = true;
              }
            })
            scrollBottom()  // 滚动页面到最底部
          }
        }
      }
    }
  },
}
</script>



<style>
.im-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.imHeader {
  margin-bottom: 5px;
}
</style>
