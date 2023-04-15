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
          <el-empty v-if="!loginUserList || loginUserList.length === 0" description="还没有人在线喔~" />
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
            style="background-color: white;position: relative; padding: 20px; border: 1px solid #ccc; border-radius: 10px; min-height: 280px; overflow-y: scroll;">
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
                  {{ item.text }}22
                </div>
              </div>

              <div v-else-if="currentUser.id === item.uid && item.toId === toUser.id"
                style="display: flex; justify-content: flex-end; margin: 20px 0;p">
                <div
                  style="line-height: 30px; background-color: lightyellow; padding: 0 10px; width:fit-content; border-radius: 10px;">
                  {{ item.text }}11
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

          </div>
          <div class="footer">
            <el-input type="textarea" v-model="text" class="inp" placeholder="请输入内容" resize="none" :rows="3"></el-input>
            <el-button class="btn" type="primary" @click="send">发送</el-button>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
// import { getUserListByIdsUsingPOST } from "@/api/user/getUserListByIdsUsingPOST"
// import V3Emoji from 'vue3-emoji'
// import 'vue3-emoji/dist/style.css'
export default {
  name: 'Chat',
  data() {
    return {
      name: 'Chat',
      // 当前用户
      currentUser: {
        id: 1,
        avatarUrl: 'https://img2.baidu.com/it/u=3618236253,1028428296&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
      },
      //在线登录用户
      loginUserList: [
        {
          id: 1,
          isNew: '11',
          avatarUrl: 'https://img2.baidu.com/it/u=3618236253,1028428296&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
          username: 'wgz1',
          profile: '....'
        },
        {
          id: 2,
          isNew: null,
          avatarUrl: 'https://img2.baidu.com/it/u=3618236253,1028428296&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
          username: 'wgz2',
          profile: '....'
        }
      ],
      loginUserIdList: [],
      toUser: null
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
      this.client = new WebSocket(`ws://123.249.33.231:8088/ws?id=${this.$store.state.user.userId}`)
      // const this.client = new WebSocket(`ws://123.249.33.231:8088/ws?id=2`)
      this.client.onopen = () => {
        console.log('open')
      }
      this.client.onclose = () => {  // 页面刷新的时候和后台websocket服务关闭的时候
        // ElMessage.error('服务器断开，请刷新重试');
        console.log('close')
      }

      // 当收到消息
      this.client.onmessage = (msg) => {
        console.log(11, msg)
        client.onmessage = (msg) => {
          console.log("收到消息", msg)
          // if (msg.data) {
          //   // console.log(msg.data)
          //   let json = JSON.parse(msg.data)
          //   const messageType = json.type;
          //   if (messageType === 10003) {
          //     addUserLoginList(json)
          //     return;
          //   }
          //   // console.log(json)
          //   if (json.uid && json.text) {  // 聊天消息
          //     messages.value.push(json)
          //     console.log(json)
          //     console.log(messages)
          //     loginUserList.value.forEach(user => {
          //       if (user.id === json.uid) {
          //         user.isNew = true;
          //       }
          //     })
          //     scrollBottom()  // 滚动页面到最底部
          //   }
          // }
        }
      },
        getHistoryMessage() {

      },
      send() {
        const client = new WebSocket("ws://123.249.33.231:8888/im")
        const messages = {
          uid: 16,  // 发消息对象
          toId: 1,  // 受消息对象
          text: '测试消息',   //消息体内容
        }
        client.onopen = function (evt) {
          console.log("Connection open ...");
          console.log("用户" + messages.uid + "给" + messages.toId + "发送消息");
          client.send(JSON.stringify(messages));
        };
      },
    },
  }
</script>



<style lang="scss">
.im-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.imHeader {
  margin-bottom: 5px;
}

.footer {
  display: flex;
  width: 100%;
  margin-top: 12px;

  .btn {
    height: 40%;
    width: 12vw;
    align-self: center;
    margin-left: 12%;
  }
}
</style>