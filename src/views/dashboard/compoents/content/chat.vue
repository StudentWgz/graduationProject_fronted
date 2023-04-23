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
          <div v-for="item in loginUserList" style="margin-bottom: 8px" @click.native.self="checkToUser(item)">
            <el-popover :width="100" placement="right" trigger="hover">
              <template #reference>
                <div v-if="item.id !== currentUser.id" style="display: flex; align-items: center;">
                  <template v-if="item.isInline">
                    <el-badge class="item" is-dot>
                      <el-avatar :size="50" :src="item.friendAvatarUrl" @click.native="checkToUser(item)" />
                    </el-badge>
                  </template>
                  <template v-else>
                    <el-avatar :size="50" :src="item.userAvatar" @click.native.self="checkToUser(item)" />
                  </template>
                  <span style="margin-left: 5px;">{{ item.friendName }}</span>
                </div>
              </template>
              <div style="line-height: 20px;margin-left: 20px;">
                <div style="font-size: 16px">{{ item.friendName }}</div>
                <div style="font-size: 12px;">{{ item.profile }}数据待定</div>
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
                  <el-avatar :size="50" :src="toUser.friendAvatarUrl" />
                  <span style="margin-left: 5px">{{ toUser.friendName }}</span>
                </div>
                <el-button type="info" @click="getHistoryMessage(toUser)">获取历史消息</el-button>
              </div>
            </el-card>
          </div>
          <div ref="divRef" class="chat-content" id="msg-box">
            <div v-for="item in messages" :key="item.id">
              <div v-if="currentUser.id === item.toId && item.uid === toUser.friendId"
                style="display: flex; margin: 20px 0;">
                <el-popover :width="100" placement="top-start" trigger="click">
                  <template #reference>
                    <img :src="toUser.friendAvatarUrl" alt=""
                      style="width: 30px; height: 30px; border-radius: 50%; margin-right: 10px">
                  </template>
                  <div style="line-height: 20px">
                    <div style="font-size: 16px">{{ toUser.userName }}</div>
                    <div style="font-size: 12px;">{{ toUser.profile }}</div>
                  </div>
                </el-popover>
                <!--          <div style="width: 50px; line-height: 30px; margin-left: 5px; color: #888; overflow: hidden; font-size: 14px">{{ item.userName }}</div>-->
                <div v-if="item.uid === toUser.friendId"
                  style="line-height: 30px; background-color: #ccc; padding: 0 10px; width:fit-content; border-radius: 10px">
                  {{ item.text }}
                </div>
              </div>
              <div v-else-if="currentUser.id === item.uid && item.toId === toUser.friendId"
                style="display: flex; justify-content: flex-end; margin: 20px 0;p">
                <div
                  style="line-height: 30px; background-color: aliceblue; padding: 0 10px; width:fit-content; border-radius: 10px;">
                  {{ item.text }}
                </div>
                <el-popover disabled :width="100" placement="top-start" trigger="hover">
                  <template #reference>
                    <img :src="currentUser.userAvatar" alt=""
                      style="width: 30px; height: 30px; border-radius: 50%; margin-left: 10px">
                  </template>
                  <div style="line-height: 20px;background-color: red;">
                    <div style="font-size: 16px">{{ currentUser.userName }}</div>
                    <div style="font-size: 12px;">{{ currentUser.profile }}</div>
                  </div>
                </el-popover>
              </div>
            </div>

          </div>
          <div class="footer">
            <el-input type="textarea" v-model="text" @keyup.enter.native="sendMsg" class="inp" placeholder="请输入内容"
              resize="none" :rows="3"></el-input>
            <el-button class="btn" type="primary" @click="sendMsg">发送</el-button>
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
import { getAllUsers, getChatRecord, showUserById } from '@/api/user';
import { mapState } from 'vuex'
export default {
  name: 'Chat',
  data() {
    return {
      name: 'Chat',
      client: null,
      // 当前用户
      currentUser: {
        id: 1,
        userAvatar: 'https://img2.baidu.com/it/u=3618236253,1028428296&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
      },
      //在线登录用户
      loginUserList: [],
      loginUserIdList: [],
      toUser: null,
      messages: [

      ],
      text: null,
    }
  },
  computed: {
    ...mapState({ userId: state => state.user.userId })
  },
  mounted() {
    this.initWebSocket()
    this.getAllUsers()
    this.getUserInfoById()
  },
  methods: {
    scroll() {
      this.$nextTick(() => {
        let scrollEl = this.$refs.divRef;
        scrollEl.scrollTo({ top: scrollEl.scrollHeight, behavior: 'smooth' });
      });
    },
    // async addUserLoginList(data) {
    //   this.loginUserIdList = JSON.parse(data.im.text)
    //   const res = await getUserListByIdsUsingPOST({
    //     ids: this.loginUserIdList.value
    //   });
    //   this.loginUserList = res.data
    // },
    initWebSocket() {
      this.client = new WebSocket(`ws://123.249.33.231:8888/im/${this.$store.state.user.userId}`)
      // this.client = new WebSocket(`ws://localhost:8888/im/${this.$store.state.user.userId}`)
      this.client.onopen = () => {
        console.log('open')
      }
      this.client.onclose = () => {  // 页面刷新的时候和后台websocket服务关闭的时候
        // ElMessage.error('服务器断开，请刷新重试');
        console.log('close')
      }

      // 当收到消息
      this.client.onmessage = (msg) => {
        console.log('收到消息：', msg.data)
        const im = JSON.parse(msg.data)
        if (msg.data.includes("userName")) {
          this.messages.push(im)
        }
        console.log('message:', this.messages)
      }
    },
    async getHistoryMessage(msg) {
      const { friendId } = msg
      const res = await getChatRecord(friendId)
      console.log(res);
    },
    async getAllUsers() {
      const res = await getAllUsers()
      const arr = []
      //将在线的用户放在在线列表的top
      res.data.forEach(((item, key) => {
        if (item.isInline) {
          arr.push(item)
          res.data.splice(key, key + 1)
        }
      }))
      this.loginUserList = [...arr, ...res.data]
    },
    checkToUser(item) {
      this.toUser = item
      console.log('toUser', this.toUser)
      this.scroll()
    },
    sendMsg() {

      console.log('currentUser.id', this.currentUser.id, 'toUser.friendId', this.toUser.friendId)

      if (!this.text.trim()) {
        this.text = null
        return
      }
      console.log(this.text);
      console.log(1111, this.toUser)
      const messages = {
        uid: this.userId,
        toId: this.toUser.friendId,
        text: this.text
      }
      // this.messages.push(messages)
      this.text = null
      this.client.send(JSON.stringify(messages));
      this.scroll()
    },
    // getMsg() {
    //   // 当收到消息
    //   this.client.onmessage = (msg) => {
    //     console.log('收到消息：', msg)
    //     this.messages.push(msg)
    //   }
    // },
    async getUserInfoById() {
      console.log('当前用户id为', this.userId)
      const res = await showUserById(this.userId)
      this.currentUser.id = res.data.id
      this.currentUser.userAvatar = res.data.userAvatar
    }
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

.chat-content {
  background-color: white;
  position: relative;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  min-height: 280px;
  max-height: 400px;
  overflow-y: scroll;

}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: #CCC;
  -webkit-box-shadow: #fafafa;
}

::-webkit-scrollbar-thumb:window-inactive {
  background: #ccc;
}

::-webkit-scrollbar {

  width: 10px;

  height: 10px;

  background-color: #fff;

}

/*定义滚动条轨道

内阴影+圆角*/

::-webkit-scrollbar-track {


  border-radius: 10px;


}

/*定义滑块

内阴影+圆角*/

::-webkit-scrollbar-thumb {

  border-radius: 4px;



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
