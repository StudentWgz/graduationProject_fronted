<template>
  <el-container>
    <el-header>
      <Header @sendName="sendName"></Header>
    </el-header>
    <el-container>
      <el-main>
        <Chat v-if="name === 'chat'"></Chat>
        <SearchFriend v-else-if="name === 'searchFriend'" :showUserByIdEvent="getUserId"></SearchFriend>
        <SearchTeam v-else-if="name === 'searchTeam'"></SearchTeam>
        <UserInfoById :toUserId="userId" v-if="userId !== 0"></UserInfoById>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import Header from './compoents/header.vue'
import Main from './compoents/main.vue'
import Chat from './compoents/content/chat.vue'
import SearchFriend from './compoents/content/searchFriend.vue'
import SearchTeam from './compoents/content/searchTeam.vue'
import UserInfoById from './compoents/content/userInfoById.vue'

export default {
  name: 'Dashboard',
  components: {
    Header,
    Main,
    Chat,
    SearchFriend,
    SearchTeam,
    UserInfoById
  },
  data() {
    return {
      name: 'searchFriend',
      userId: ''
    }
  },
  computed: {
    ...mapGetters(['userName'])
  },
  methods: {
    sendName(val) {
      console.log('teamName', val);
      this.name = val
    },
    getUserId(id) {
      this.name = ''
      this.userId = id
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
