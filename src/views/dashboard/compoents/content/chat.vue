<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">
        <el-card class="box-card" style="width: 200px">
          <template #header>
            <div class="user-card-header">
              <span>在线列表</span>
            </div>
          </template>
          <el-empty v-if="!loginUserList || loginUserList.length === 1" description="还没有人在线喔~" />
          <div v-for="item in loginUserList" style="margin-bottom: 8px">
            <el-popover :width="200" placement="top-start" trigger="hover">
              <template #reference>
                <div v-if="item.id !== currentUser.id" style="display: flex; align-items: center;">
                  <template v-if="item.isNew">
                    <el-badge class="item" is-dot>
                      <el-avatar :size="50" :src="item.avatarUrl" @click="checkToUser(item)" />
                    </el-badge>
                  </template>
                  <template v-else>
                    <el-avatar :size="50" :src="item.avatarUrl" @click="checkToUser(item)" />
                  </template>
                  <span style="margin-left: 5px">{{ item.username }}</span>
                </div>
              </template>
              <div style="line-height: 20px">
                <div style="font-size: 16px">{{ item.username }}</div>
                <div style="font-size: 12px;">{{ item.profile }}</div>
              </div>
            </el-popover>
          </div>
        </el-card>

      </el-aside>

      <el-main style="padding: 0">
        <div v-if="!toUser">
          <el-empty :image-size="200" description="快去选择一名好友聊天吧！" />
        </div>

        <div v-else style="width: 90%; margin: 0 auto">
          <div class="imHeader">
            <el-card class="box-card">

              <div slot="header" class="im-card-header">
                <div style="display: flex; align-items: center;">
                  <el-avatar :size="50" :src="toUser.avatarUrl" />
                  <span style="margin-left: 5px">{{ toUser.username }}</span>
                </div>
                <el-button type="info" @click="getHistoryMessage">获取历史消息</el-button>
              </div>
            </el-card>
          </div>
          <div ref="divRef"
            style="background-color: white; padding: 20px; border: 1px solid #ccc; border-radius: 10px; height: 380px; overflow-y: scroll;">
            <div v-for="item in messages" :key="item.id">
              <div v-if="currentUser.id !== item.uid && item.uid === toUser.id" style="display: flex; margin: 20px 0;">
                <el-popover :width="100" placement="top-start" trigger="click">
                  <template #reference>
                    <img :src="toUser.avatarUrl" alt=""
                      style="width: 30px; height: 30px; border-radius: 50%; margin-right: 10px">
                  </template>
                  <div style="line-height: 20px">
                    <div style="font-size: 16px">{{ toUser.username }}</div>
                    <div style="font-size: 12px;">{{ toUser.profile }}</div>
                  </div>
                </el-popover>
                <!--          <div style="width: 50px; line-height: 30px; margin-left: 5px; color: #888; overflow: hidden; font-size: 14px">{{ item.username }}</div>-->
                <div v-if="item.uid === toUser.id"
                  style="line-height: 30px; background-color: aliceblue; padding: 0 10px; width:fit-content; border-radius: 10px">
                  {{ item.text }}
                </div>
              </div>

              <div v-else-if="currentUser.id === item.uid && item.toId === toUser.id"
                style="display: flex; justify-content: flex-end; margin: 20px 0;">
                <div
                  style="line-height: 30px; background-color: lightyellow; padding: 0 10px; width:fit-content; border-radius: 10px;">
                  {{ item.text }}
                </div>
                <el-popover :width="100" placement="top-start" trigger="hover">
                  <template #reference>
                    <img :src="currentUser.avatarUrl" alt=""
                      style="width: 30px; height: 30px; border-radius: 50%; margin-left: 10px">
                  </template>
                  <div style="line-height: 20px">
                    <div style="font-size: 16px">{{ currentUser.username }}</div>
                    <div style="font-size: 12px;">{{ currentUser.profile }}</div>
                  </div>
                </el-popover>
              </div>
            </div>
          0/div=-77；
          <div style="margin: 10px 0; width: 100%">
            <V3Emoji v-model="text" :keep="true" :options-name="optionsName" :recent="true" :textArea="true"
              default-select="recent" size="mid" />
            <div style="text-align: right">
              <el-button type="primary" @click="send">发送</el-button>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
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
